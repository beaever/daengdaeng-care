// 반려견 프로필 데이터 접근. v1.0은 단일 프로필(id=1 고정)만 지원한다.
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

const PET_ID = 1;

export async function getPet(db: SQLiteDatabase): Promise<Pet | null> {
  const row = await db.getFirstAsync<Pet>(
    'SELECT id, name, breed, dob, sex, neutered, photo FROM pets WHERE id = $id',
    { $id: PET_ID }
  );
  return row ?? null;
}

// INSERT OR REPLACE 는 쓰지 않는다 — records.pet_id FK가 걸려 있어 REPLACE의
// delete+insert 동작이 기존 pet row를 삭제하면 기록이 고아가 된다.
export async function savePet(db: SQLiteDatabase, input: Omit<Pet, 'id'>): Promise<void> {
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
    {
      $id: PET_ID,
      $name: input.name,
      $breed: input.breed,
      $dob: input.dob,
      $sex: input.sex,
      $neutered: input.neutered,
      $photo: input.photo,
    }
  );
}

/**
 * expo-image-picker 로 고른 사진을 document 디렉터리에 pet-<timestamp>.jpg 로 복사하고,
 * 이전 파일이 있으면 삭제한다. 반환값은 파일명만 (절대 URI 아님 — iOS 컨테이너 UUID가
 * 재설치/업데이트마다 바뀌므로 절대 URI를 저장하면 다음 실행에서 깨진다).
 */
export function savePetPhoto(pickedUri: string, prev?: string | null): string {
  const filename = `pet-${Date.now()}.jpg`;
  const dest = new File(Paths.document, filename);
  new File(pickedUri).copySync(dest, { overwrite: true });

  if (prev) {
    const prevFile = new File(Paths.document, prev);
    if (prevFile.exists) prevFile.delete();
  }

  return filename;
}

/** DB에 저장된 파일명을 현재 세션의 document 디렉터리 기준 URI로 변환한다. */
export function photoUri(photo: string | null): string | undefined {
  if (!photo) return undefined;
  return new File(Paths.document, photo).uri;
}

export function usePet(): { pet: Pet | null | undefined; reload: () => void } {
  const db = useSQLiteContext();
  const [pet, setPet] = useState<Pet | null | undefined>(undefined);

  const reload = useCallback(() => {
    getPet(db).then(setPet);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  return { pet, reload };
}
