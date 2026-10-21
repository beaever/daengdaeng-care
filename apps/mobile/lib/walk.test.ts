import type { SQLiteDatabase } from 'expo-sqlite';
import * as Location from 'expo-location';
import { handleLocations, walkSession } from './walkTask';
import { pendingSummary, saveResult, start } from './walk';

jest.mock('expo-task-manager', () => ({ defineTask: jest.fn() }));
jest.mock('expo-location', () => ({
  Accuracy: { BestForNavigation: 6 },
  ActivityType: { Fitness: 3 },
  requestForegroundPermissionsAsync: jest.fn(),
  startLocationUpdatesAsync: jest.fn().mockResolvedValue(undefined),
  stopLocationUpdatesAsync: jest.fn().mockResolvedValue(undefined),
  hasStartedLocationUpdatesAsync: jest.fn().mockResolvedValue(false),
}));

type P = { record_id: number | null; seg: number; ts: number; lat: number; lng: number };

/** walk_points / records INSERT·UPDATE·DELETE 만 흉내 내는 최소 fake */
function fakeDb() {
  const points: P[] = [];
  const sql: string[] = [];
  const db = {
    getFirstAsync: jest.fn(async () => {
      const unsaved = points.filter((p) => p.record_id === null);
      return unsaved[unsaved.length - 1] ?? null;
    }),
    runAsync: jest.fn(async (q: string, a?: Record<string, number>) => {
      sql.push(q);
      if (/INSERT INTO walk_points/.test(q)) points.push({ record_id: null, seg: a!.$seg, ts: a!.$ts, lat: a!.$lat, lng: a!.$lng });
      if (/UPDATE walk_points/.test(q)) points.forEach((p) => p.record_id === null && (p.record_id = a!.$id));
      if (/DELETE FROM walk_points/.test(q)) points.splice(0, points.length, ...points.filter((p) => p.record_id !== null));
      return { lastInsertRowId: 7, changes: 1 };
    }),
    withTransactionAsync: jest.fn((fn: () => Promise<void>) => fn()),
  };
  return { db: db as unknown as SQLiteDatabase, points, sql };
}

const loc = (ts: number, lat: number) => ({ timestamp: ts, coords: { latitude: lat, longitude: 127, accuracy: 5 } });

describe('walkTask handleLocations', () => {
  afterEach(() => {
    walkSession.current = null;
  });

  it('메모리 세션이 없으면 포인트를 무시한다', async () => {
    const { db, points } = fakeDb();
    await handleLocations(db, [loc(1000, 37)]);
    expect(points).toHaveLength(0);
  });

  it('세션이 있으면 acceptPoint 통과분만 현재 seg 로 저장한다', async () => {
    const { db, points } = fakeDb();
    walkSession.current = { startedAt: 1000, seg: 2 };
    // 캐시(ts<startedAt) 버림, 첫 점 통과, 제자리(<3m) 버림, 10m 이동 통과
    await handleLocations(db, [loc(500, 37), loc(2000, 37), loc(3000, 37.000001), loc(8000, 37.0001)]);
    expect(points.map((p) => [p.seg, p.ts])).toEqual([
      [2, 2000],
      [2, 8000],
    ]);
  });
});

describe('saveResult', () => {
  it('포인트 >= 2 면 records INSERT 후 미저장 포인트를 record_id 로 연결한다', async () => {
    const { db, points } = fakeDb();
    walkSession.current = { startedAt: 0, seg: 0 };
    await handleLocations(db, [loc(1000, 37), loc(60000, 37.001)]);
    await saveResult(db, { minutes: 32, distanceM: 1200, pointCount: points.length }, { date: '2026-10-21' });
    expect(points.every((p) => p.record_id === 7)).toBe(true);
    const insert = (db.runAsync as jest.Mock).mock.calls.find(([q]) => /INSERT INTO records/.test(q));
    expect(insert[1]).toMatchObject({ $title: '32분 산책', $sub: '1.2km' });
  });

  it('포인트 < 2 면 경로 없이 저장하고 포인트를 삭제한다', async () => {
    const { db, points } = fakeDb();
    points.push({ record_id: null, seg: 0, ts: 1, lat: 37, lng: 127 });
    await saveResult(db, { minutes: 5, distanceM: 0, pointCount: 1 }, { date: '2026-10-21' });
    expect(points).toHaveLength(0);
    const insert = (db.runAsync as jest.Mock).mock.calls.find(([q]) => /INSERT INTO records/.test(q));
    expect(insert[1].$sub).toBeNull();
  });
});

describe('pendingSummary', () => {
  it('시간은 seg 별 (마지막 - 첫) ts 합 — 일시정지 공백은 제외', () => {
    const min = 60_000;
    const s = pendingSummary([
      { seg: 0, ts: 0, lat: 37, lng: 127 },
      { seg: 0, ts: 10 * min, lat: 37.001, lng: 127 },
      { seg: 1, ts: 60 * min, lat: 37.01, lng: 127 },
      { seg: 1, ts: 65 * min, lat: 37.011, lng: 127 },
    ]);
    expect(s.minutes).toBe(15);
    expect(s.pointCount).toBe(4);
  });
});

describe('start', () => {
  it('권한 거부면 수신을 시작하지 않는다 (Always 권한 요청 없음)', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });
    const { db } = fakeDb();
    expect(await start(db)).toEqual({ ok: false, reason: 'denied' });
    expect(Location.startLocationUpdatesAsync).not.toHaveBeenCalled();
  });
});
