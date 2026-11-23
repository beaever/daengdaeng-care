// 건강 기록 데이터 접근. 현재 반려견(settings.current_pet_id)의 기록만 다룬다.
// 컬럼 매핑은 docs/harness/BACKEND.md 를 단일 출처로 따른다.
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { type SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { currentPetId, deletePetPhoto } from './pets';
import { rescheduleAll } from './notifications';
import type { RoutePoint } from './geo';

export type RecordType = 'vaccine' | 'weight' | 'vet' | 'walk' | 'medicine';

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

export async function listRecords(db: SQLiteDatabase): Promise<HealthRecord[]> {
  const petId = await currentPetId(db);
  if (petId === null) return [];
  return db.getAllAsync<HealthRecord>(
    `SELECT id, pet_id, type, date, title, sub, notes, next_date, photo, created_at,
            EXISTS(SELECT 1 FROM walk_points WHERE record_id = records.id) AS has_route
     FROM records WHERE pet_id = $petId ORDER BY date DESC, id DESC`,
    { $petId: petId }
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
  const petId = await currentPetId(db);
  if (petId === null) throw new Error('반려견 프로필이 없어요');
  await db.runAsync(
    `INSERT INTO records (pet_id, type, date, title, sub, notes, next_date, photo)
     VALUES ($petId, $type, $date, $title, $sub, $notes, $nextDate, $photo)`,
    {
      $petId: petId,
      $type: input.type,
      $date: input.date,
      $title: input.title,
      $sub: input.sub ?? null,
      $notes: input.notes ?? null,
      $nextDate: input.next_date ?? null,
      $photo: input.photo ?? null,
    }
  );
  await rescheduleAll(db);
}

export async function deleteRecord(db: SQLiteDatabase, id: number): Promise<void> {
  const row = await db.getFirstAsync<{ photo: string | null }>('SELECT photo FROM records WHERE id = $id', { $id: id });
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM walk_points WHERE record_id = $id', { $id: id });
    await db.runAsync('DELETE FROM records WHERE id = $id', { $id: id });
  });
  // DB 삭제가 끝난 뒤에 파일을 지운다 — 반대 순서면 삭제 실패 시 사진만 사라진다.
  // 파일 삭제 실패는 기록 삭제 실패가 아니다(남은 파일은 화면에 안 보인다).
  try {
    if (row?.photo) deletePetPhoto(row.photo);
  } catch {}
  await rescheduleAll(db);
}

/** 삭제 확인 → 삭제 → 목록 새로고침(실패해도). 기록 탭·산책 탭 공용. */
export function confirmDeleteRecord(db: SQLiteDatabase, id: number, reload: () => void): void {
  Alert.alert('기록을 삭제할까요?', undefined, [
    { text: '취소', style: 'cancel' },
    {
      text: '삭제',
      style: 'destructive',
      onPress: () =>
        deleteRecord(db, id)
          .catch(() => Alert.alert('삭제하지 못했어요', '잠시 후 다시 시도해주세요.'))
          .finally(reload),
    },
  ]);
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
