// 산책 경로 기록. 진행 중 세션 = walk_points.record_id IS NULL 행 + 메모리 상태(walkTask.walkSession).
// 위치 권한은 When In Use(foreground)만 요청한다 — Always/background 권한 요청 금지.
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { type SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { formatDistance, routeDistance, type RoutePoint } from './geo';
import { savePetPhoto, deletePetPhoto } from './pets';
import { toLocalDateString } from './recordSummary';
import { WALK_TASK, walkSession } from './walkTask';

export type WalkPhase = 'idle' | 'recording' | 'paused' | 'finished';

interface State {
  phase: WalkPhase;
  /** 일시정지 전까지 누적된 활동 시간(ms) */
  accumMs: number;
  /** 현재 구간 시작 시각. 녹화 중일 때만 */
  activeSince: number | null;
  result: WalkResult | null;
}
const IDLE: State = { phase: 'idle', accumMs: 0, activeSince: null, result: null };
let state: State = IDLE;

export interface WalkResult {
  minutes: number;
  distanceM: number;
  points: RoutePoint[];
}

export type StartResult = { ok: true; reducedAccuracy: boolean } | { ok: false; reason: 'denied' | 'error' };

const elapsed = (now = Date.now()) => state.accumMs + (state.activeSince ? now - state.activeSince : 0);

function startUpdates(): Promise<void> {
  return Location.startLocationUpdatesAsync(WALK_TASK, {
    accuracy: Location.Accuracy.BestForNavigation,
    activityType: Location.ActivityType.Fitness,
    distanceInterval: 5,
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
  });
}

async function stopUpdates(): Promise<void> {
  if (await Location.hasStartedLocationUpdatesAsync(WALK_TASK)) await Location.stopLocationUpdatesAsync(WALK_TASK);
}

/** 앱 시작 시 호출 — 강제 종료 전에 등록된 태스크를 복원했으면 멈춘다 (파란 위치 표시 끄기). */
export async function stopLeftoverUpdates(): Promise<void> {
  if (walkSession.current) return;
  try {
    await stopUpdates();
  } catch {
    // 정리 실패가 앱 시작을 막으면 안 된다
  }
}

/**
 * 산책 시작. foreground 권한만 요청한다. 이전 미저장 포인트는 지운다
 * (호출 전에 recoverPending 으로 사용자에게 먼저 물을 것).
 * reducedAccuracy=true 면 정확도 필터가 포인트를 거의 다 버리므로 화면에서 안내한다.
 */
export async function start(db: SQLiteDatabase): Promise<StartResult> {
  const perm = await Location.requestForegroundPermissionsAsync();
  if (!perm.granted) return { ok: false, reason: 'denied' };
  try {
    await db.runAsync('DELETE FROM walk_points WHERE record_id IS NULL');
    const now = Date.now();
    walkSession.current = { startedAt: now, seg: 0 };
    state = { phase: 'recording', accumMs: 0, activeSince: now, result: null };
    await startUpdates();
    return { ok: true, reducedAccuracy: perm.ios?.accuracy === 'reduced' };
  } catch {
    walkSession.current = null;
    state = IDLE;
    return { ok: false, reason: 'error' };
  }
}

export async function pause(): Promise<void> {
  if (state.phase !== 'recording') return;
  state = { ...state, phase: 'paused', accumMs: elapsed(), activeSince: null };
  await stopUpdates();
}

export async function resume(): Promise<void> {
  if (state.phase !== 'paused' || !walkSession.current) return;
  walkSession.current = { ...walkSession.current, seg: walkSession.current.seg + 1 };
  state = { ...state, phase: 'recording', activeSince: Date.now() };
  await startUpdates();
}

export async function listUnsavedPoints(db: SQLiteDatabase): Promise<RoutePoint[]> {
  return db.getAllAsync<RoutePoint>('SELECT seg, ts, lat, lng FROM walk_points WHERE record_id IS NULL ORDER BY id');
}

/** 수신을 멈추고 결과를 계산한다. 저장은 save, 취소는 discard. */
export async function finish(db: SQLiteDatabase): Promise<WalkResult> {
  const ms = elapsed();
  walkSession.current = null;
  await stopUpdates();
  const points = await listUnsavedPoints(db);
  const result = { minutes: Math.max(1, Math.round(ms / 60000)), distanceM: routeDistance(points), points };
  state = { phase: 'finished', accumMs: ms, activeSince: null, result };
  return result;
}

/** records INSERT + 미저장 포인트 연결을 한 트랜잭션으로. 포인트 < 2 면 경로 없이(포인트 삭제) 저장한다. */
export async function saveResult(
  db: SQLiteDatabase,
  r: { minutes: number; distanceM: number; pointCount: number },
  opts: { photo?: string | null; notes?: string | null; date?: string } = {}
): Promise<void> {
  // 사진 복사는 트랜잭션 전에, 저장 실패 시 파일 삭제 (savePet 과 같은 순서)
  const photo = opts.photo ? savePetPhoto(opts.photo) : null;
  const hasRoute = r.pointCount >= 2;
  try {
    await db.withTransactionAsync(async () => {
      const res = await db.runAsync(
        `INSERT INTO records (pet_id, type, date, title, sub, notes, photo)
         VALUES (1, 'walk', $date, $title, $sub, $notes, $photo)`,
        {
          $date: opts.date ?? toLocalDateString(new Date()),
          $title: `${r.minutes}분 산책`,
          $sub: hasRoute ? formatDistance(r.distanceM) : null,
          $notes: opts.notes || null,
          $photo: photo,
        }
      );
      if (hasRoute) {
        await db.runAsync('UPDATE walk_points SET record_id = $id WHERE record_id IS NULL', { $id: res.lastInsertRowId });
      } else {
        await db.runAsync('DELETE FROM walk_points WHERE record_id IS NULL');
      }
    });
  } catch (e) {
    if (photo) deletePetPhoto(photo);
    throw e;
  }
}

/** finish() 이후 저장. 성공하면 세션 상태를 비운다. */
export async function save(db: SQLiteDatabase, opts: { photo?: string | null; notes?: string | null } = {}): Promise<void> {
  const r = state.result;
  if (!r) throw new Error('finish() 이전에는 저장할 수 없어요');
  await saveResult(db, { minutes: r.minutes, distanceM: r.distanceM, pointCount: r.points.length }, opts);
  state = IDLE;
}

/** 미저장 포인트를 버리고 세션을 끝낸다 (진행 중이어도 수신을 멈춘다). */
export async function discard(db: SQLiteDatabase): Promise<void> {
  walkSession.current = null;
  state = IDLE;
  await stopUpdates();
  await db.runAsync('DELETE FROM walk_points WHERE record_id IS NULL');
}

export interface PendingWalk {
  minutes: number;
  distanceM: number;
  pointCount: number;
}

/** seg 별 (마지막 ts − 첫 ts) 합 → 분. 최소 1분. */
export function pendingSummary(points: RoutePoint[]): PendingWalk {
  const bySeg = new Map<number, { first: number; last: number }>();
  for (const p of points) {
    const s = bySeg.get(p.seg);
    if (s) s.last = p.ts;
    else bySeg.set(p.seg, { first: p.ts, last: p.ts });
  }
  let ms = 0;
  bySeg.forEach((s) => (ms += s.last - s.first));
  return { minutes: Math.max(1, Math.round(ms / 60000)), distanceM: routeDistance(points), pointCount: points.length };
}

/** 강제 종료로 남은 미저장 포인트가 있으면 요약을, 없으면 null. 저장은 saveResult(db, 요약, {...}), 버리기는 discard(db). */
export async function recoverPending(db: SQLiteDatabase): Promise<PendingWalk | null> {
  const points = await listUnsavedPoints(db);
  return points.length ? pendingSummary(points) : null;
}

export interface WalkSessionView {
  phase: WalkPhase;
  elapsedMs: number;
  distanceM: number;
  points: RoutePoint[];
}

/** 진행 화면용. 1초마다 경과 시간과 DB 포인트를 갱신한다 (이벤트 대신 단순 폴링). */
export function useWalkSession(): WalkSessionView {
  const db = useSQLiteContext();
  const [view, setView] = useState<WalkSessionView>({ phase: state.phase, elapsedMs: 0, distanceM: 0, points: [] });

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const points = state.result?.points ?? (state.phase === 'idle' ? [] : await listUnsavedPoints(db));
      if (alive) setView({ phase: state.phase, elapsedMs: elapsed(), distanceM: routeDistance(points), points });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [db]);

  return view;
}
