// 건강 기록 데이터 접근. v1.0은 단일 프로필(pet_id=1 고정)만 지원한다.
// 컬럼 매핑은 docs/harness/BACKEND.md 를 단일 출처로 따른다.
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { type SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { addYears } from './recordSummary';

export type RecordType = 'vaccine' | 'weight' | 'vet';

export interface HealthRecord {
  id: number;
  pet_id: number;
  type: RecordType;
  date: string;
  title: string;
  sub: string | null;
  notes: string | null;
  next_date: string | null;
  created_at: string;
}

export type NewRecord = Pick<HealthRecord, 'type' | 'date' | 'title'> &
  Partial<Pick<HealthRecord, 'sub' | 'notes' | 'next_date'>>;

const PET_ID = 1;

export async function listRecords(db: SQLiteDatabase): Promise<HealthRecord[]> {
  return db.getAllAsync<HealthRecord>(
    `SELECT id, pet_id, type, date, title, sub, notes, next_date, created_at
     FROM records WHERE pet_id = $petId ORDER BY date DESC, id DESC`,
    { $petId: PET_ID }
  );
}

export async function addRecord(db: SQLiteDatabase, input: NewRecord): Promise<void> {
  // 다음 접종 예정일 기본값: 접종일 + 1년 (백신별 주기표 없음 — 사용자 결정).
  // 호출자가 next_date를 명시하면(사용자가 직접 수정한 값) 그 값을 그대로 쓴다.
  const nextDate =
    input.next_date !== undefined ? input.next_date : input.type === 'vaccine' ? addYears(input.date, 1) : null;

  await db.runAsync(
    `INSERT INTO records (pet_id, type, date, title, sub, notes, next_date)
     VALUES ($petId, $type, $date, $title, $sub, $notes, $nextDate)`,
    {
      $petId: PET_ID,
      $type: input.type,
      $date: input.date,
      $title: input.title,
      $sub: input.sub ?? null,
      $notes: input.notes ?? null,
      $nextDate: nextDate,
    }
  );
}

export async function deleteRecord(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM records WHERE id = $id', { $id: id });
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
