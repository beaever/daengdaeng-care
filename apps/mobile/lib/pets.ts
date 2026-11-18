// 반려견 프로필 데이터 접근. 다견 지원 — 현재 반려견은 settings.current_pet_id.
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { File, Paths } from 'expo-file-system';
import { type SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';

export { formatAge } from './age';

export interface Pet {
  id: number;
  name: string;
  breed: string | null;
  dob: string | null;
  sex: '남아' | '여아' | null;
  neutered: 0 | 1 | null;
  photo: string | null;
}

const COLS = 'id, name, breed, dob, sex, neutered, photo';
// 현재 반려견 = settings.current_pet_id. 키가 없거나 삭제된 id 면 가장 작은 id.
const CURRENT_ORDER = `ORDER BY id = (SELECT CAST(value AS INTEGER) FROM settings WHERE key = 'current_pet_id') DESC, id LIMIT 1`;

export async function getPet(db: SQLiteDatabase): Promise<Pet | null> {
  return (await db.getFirstAsync<Pet>(`SELECT ${COLS} FROM pets ${CURRENT_ORDER}`)) ?? null;
}

export async function currentPetId(db: SQLiteDatabase): Promise<number | null> {
  const row = await db.getFirstAsync<{ id: number }>(`SELECT id FROM pets ${CURRENT_ORDER}`);
  return row?.id ?? null;
}

export async function listPets(db: SQLiteDatabase): Promise<Pet[]> {
  return db.getAllAsync<Pet>(`SELECT ${COLS} FROM pets ORDER BY id`);
}

export async function setCurrentPet(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync(`INSERT OR REPLACE INTO settings (key, value) VALUES ('current_pet_id', $v)`, { $v: String(id) });
}

// pets 에는 INSERT OR REPLACE 를 쓰지 않는다 — REPLACE 의 delete+insert 가 기존 pet row 를
// 지우면 기록이 고아가 된다. (settings 는 연결 데이터가 없는 key-value 라 REPLACE 무방)
/** id 가 있으면 수정, 없으면 추가하고 새 반려견을 현재 반려견으로 지정. 저장된 id 를 돌려준다. */
export async function savePet(db: SQLiteDatabase, input: Omit<Pet, 'id'>, id?: number): Promise<number> {
  const params = {
    $name: input.name,
    $breed: input.breed,
    $dob: input.dob,
    $sex: input.sex,
    $neutered: input.neutered,
    $photo: input.photo,
  };
  if (id !== undefined) {
    await db.runAsync(
      `INSERT INTO pets (id, name, breed, dob, sex, neutered, photo)
       VALUES ($id, $name, $breed, $dob, $sex, $neutered, $photo)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         breed = excluded.breed,
         dob = excluded.dob,
         sex = excluded.sex,
         neutered = excluded.neutered,
         photo = excluded.photo`,
      { $id: id, ...params }
    );
    return id;
  }
  const res = await db.runAsync(
    `INSERT INTO pets (name, breed, dob, sex, neutered, photo)
     VALUES ($name, $breed, $dob, $sex, $neutered, $photo)`,
    params
  );
  await setCurrentPet(db, res.lastInsertRowId);
  return res.lastInsertRowId;
}

/**
 * 반려견과 연결 데이터(기록·경로 포인트)를 한 트랜잭션으로 지운다 — 외래키가 꺼져 있어 직접 지워야 한다.
 * record_id IS NULL 인 진행 중 산책 포인트는 반려견과 무관하므로 보존한다.
 */
export async function deletePet(db: SQLiteDatabase, id: number): Promise<void> {
  const pet = await db.getFirstAsync<{ photo: string | null }>('SELECT photo FROM pets WHERE id = $id', { $id: id });
  const recs = await db.getAllAsync<{ photo: string | null }>(
    'SELECT photo FROM records WHERE pet_id = $id AND photo IS NOT NULL',
    { $id: id }
  );
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM walk_points WHERE record_id IN (SELECT id FROM records WHERE pet_id = $id)', { $id: id });
    await db.runAsync('DELETE FROM records WHERE pet_id = $id', { $id: id });
    await db.runAsync('DELETE FROM pets WHERE id = $id', { $id: id });
    await db.runAsync(`DELETE FROM settings WHERE key = 'current_pet_id' AND CAST(value AS INTEGER) = $id`, { $id: id });
  });
  // DB 삭제가 끝난 뒤 파일 삭제 — 실패해도 삭제 실패로 보지 않는다(deleteRecord 와 같은 규칙).
  for (const photo of [...recs.map((r) => r.photo), pet?.photo]) {
    try {
      if (photo) deletePetPhoto(photo);
    } catch {}
  }
}

/**
 * expo-image-picker 로 고른 사진을 document 디렉터리에 pet-<timestamp>.jpg 로 복사한다.
 * 반환값은 파일명만 (절대 URI 아님 — iOS 컨테이너 UUID가 재설치/업데이트마다 바뀌므로
 * 절대 URI를 저장하면 다음 실행에서 깨진다).
 */
export function savePetPhoto(pickedUri: string): string {
  const filename = `pet-${Date.now()}.jpg`;
  const dest = new File(Paths.document, filename);
  new File(pickedUri).copySync(dest, { overwrite: true });
  return filename;
}

/** 이전 사진 파일을 지운다. DB가 새 파일명으로 저장된 뒤에만 부른다 — 먼저 지우면 저장 실패 시 사진이 사라진다. */
export function deletePetPhoto(photo: string): void {
  const file = new File(Paths.document, photo);
  if (file.exists) file.delete();
}

/** DB에 저장된 파일명을 현재 세션의 document 디렉터리 기준 URI로 변환한다. */
export function photoUri(photo: string | null): string | undefined {
  if (!photo) return undefined;
  return new File(Paths.document, photo).uri;
}

export function usePet(): { pet: Pet | null | undefined; pets: Pet[]; reload: () => void } {
  const db = useSQLiteContext();
  const [pet, setPet] = useState<Pet | null | undefined>(undefined);
  const [pets, setPets] = useState<Pet[]>([]);

  const reload = useCallback(() => {
    getPet(db).then(setPet);
    listPets(db).then(setPets);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  return { pet, pets, reload };
}
