// 백그라운드 위치 태스크. app/_layout.tsx 최상단 import 로 앱 시작 시 전역 정의된다.
// expo-task-manager 는 등록된 태스크를 다음 실행 때 복원하므로, 메모리 세션이 없으면 포인트를 무시한다.
import * as TaskManager from 'expo-task-manager';
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { DATABASE_NAME } from './db';
import { acceptPoint, type RoutePoint } from './geo';

export const WALK_TASK = 'walk-location-task';

/** 진행 중(녹화 중) 세션. null 이면 포인트를 저장하지 않는다. 앱 프로세스 메모리에만 있다. */
export const walkSession: { current: { startedAt: number; seg: number } | null } = { current: null };

interface LocationLike {
  timestamp: number;
  coords: { latitude: number; longitude: number; accuracy: number | null };
}

export async function handleLocations(db: SQLiteDatabase, locations: LocationLike[]): Promise<void> {
  const s = walkSession.current;
  if (!s) return;
  for (const loc of locations) {
    const prev = await db.getFirstAsync<RoutePoint>(
      'SELECT seg, ts, lat, lng FROM walk_points WHERE record_id IS NULL ORDER BY id DESC LIMIT 1'
    );
    const next = { lat: loc.coords.latitude, lng: loc.coords.longitude, ts: loc.timestamp, accuracy: loc.coords.accuracy };
    if (!acceptPoint(prev, next, s.startedAt)) continue;
    await db.runAsync('INSERT INTO walk_points (record_id, seg, ts, lat, lng) VALUES (NULL, $seg, $ts, $lat, $lng)', {
      $seg: s.seg,
      $ts: next.ts,
      $lat: next.lat,
      $lng: next.lng,
    });
  }
}

// 앱의 SQLiteProvider 와 같은 파일을 연다. WAL 모드(migrate 에서 설정)라 읽기·쓰기 동시 접근이 가능하다.
let dbPromise: Promise<SQLiteDatabase> | null = null;

TaskManager.defineTask<{ locations: LocationLike[] }>(WALK_TASK, async ({ data, error }) => {
  if (error || !data?.locations || !walkSession.current) return;
  dbPromise ??= openDatabaseAsync(DATABASE_NAME);
  await handleLocations(await dbPromise, data.locations);
});
