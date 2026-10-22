// 건강 기록 데이터 접근. v1.0은 단일 프로필(pet_id=1 고정)만 지원한다.
// 컬럼 매핑은 docs/harness/BACKEND.md 를 단일 출처로 따른다.
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { type SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { addYears } from './recordSummary';
import { deletePetPhoto } from './pets';
import type { RoutePoint } from './geo';

export type RecordType = 'vaccine' | 'weight' | 'vet' | 'walk';

export interface HealthRecord {
  id: number;
  pet_id: number;
  type: RecordType;
  date: string;
  title: string;
  sub: string | null;
  notes: string | null;
  next_date: string | null;
  /** document 디렉터리 기준 파일명 (savePetPhoto 반환값) */
  photo: string | null;
  /** 경로(walk_points)가 저장돼 있으면 1 — SQLite EXISTS 결과는 숫자 */
  has_route: 0 | 1;
  created_at: string;
}

export type NewRecord = Pick<HealthRecord, 'type' | 'date' | 'title'> &
  Partial<Pick<HealthRecord, 'sub' | 'notes' | 'next_date' | 'photo'>>;

const PET_ID = 1;

export async function listRecords(db: SQLiteDatabase): Promise<HealthRecord[]> {
  return db.getAllAsync<HealthRecord>(
    `SELECT id, pet_id, type, date, title, sub, notes, next_date, photo, created_at,
            EXISTS(SELECT 1 FROM walk_points WHERE record_id = records.id) AS has_route
     FROM records WHERE pet_id = $petId ORDER BY date DESC, id DESC`,
    { $petId: PET_ID }
  );
}

export async function getRecord(db: SQLiteDatabase, id: number): Promise<HealthRecord | null> {
  return db.getFirstAsync<HealthRecord>(
    `SELECT id, pet_id, type, date, title, sub, notes, next_date, photo, created_at,
            EXISTS(SELECT 1 FROM walk_points WHERE record_id = records.id) AS has_route
     FROM records WHERE id = $id`,
    { $id: id }
  );
}

export async function listRoutePoints(db: SQLiteDatabase, recordId: number): Promise<RoutePoint[]> {
  return db.getAllAsync<RoutePoint>(
    'SELECT seg, ts, lat, lng FROM walk_points WHERE record_id = $id ORDER BY seg, ts',
    { $id: recordId }
  );
}

export async function addRecord(db: SQLiteDatabase, input: NewRecord): Promise<void> {
  // 다음 접종 예정일 기본값: 접종일 + 1년 (백신별 주기표 없음 — 사용자 결정).
  // 호출자가 next_date를 명시하면(사용자가 직접 수정한 값) 그 값을 그대로 쓴다.
  const nextDate =
    input.next_date !== undefined ? input.next_date : input.type === 'vaccine' ? addYears(input.date, 1) : null;

  await db.runAsync(
    `INSERT INTO records (pet_id, type, date, title, sub, notes, next_date, photo)
     VALUES ($petId, $type, $date, $title, $sub, $notes, $nextDate, $photo)`,
    {
      $petId: PET_ID,
      $type: input.type,
      $date: input.date,
      $title: input.title,
      $sub: input.sub ?? null,
      $notes: input.notes ?? null,
      $nextDate: nextDate,
      $photo: input.photo ?? null,
    }
  );
}

export async function deleteRecord(db: SQLiteDatabase, id: number): Promise<void> {
  const row = await db.getFirstAsync<{ photo: string | null }>('SELECT photo FROM records WHERE id = $id', { $id: id });
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM walk_points WHERE record_id = $id', { $id: id });
    await db.runAsync('DELETE FROM records WHERE id = $id', { $id: id });
  });
  // DB 삭제가 끝난 뒤에 파일을 지운다 — 반대 순서면 삭제 실패 시 사진만 사라진다.
  if (row?.photo) deletePetPhoto(row.photo);
}

export function useRecords(): { records: HealthRecord[] | undefined; reload: () => void } {
  const db = useSQLiteContext();
  const [records, setRecords] = useState<HealthRecord[] | undefined>(undefined);

  const reload = useCallback(() => {
    listRecords(db).then(setRecords);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  return { records, reload };
}
