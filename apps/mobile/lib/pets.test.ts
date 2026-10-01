import { savePet, photoUri, type Pet } from './pets';
import type { SQLiteDatabase } from 'expo-sqlite';

describe('photoUri', () => {
  it('photo 가 null 이면 undefined', () => {
    expect(photoUri(null)).toBeUndefined();
  });

  it('파일명을 document 디렉터리 기준 URI로 변환한다 (절대 URI 저장 금지)', () => {
    const uri = photoUri('pet-123.jpg');
    expect(uri).toBe('file:///mock/document/pet-123.jpg');
  });
});

describe('savePet', () => {
  // records.pet_id FK가 걸려 있어 INSERT OR REPLACE(delete+insert)로 회귀하면
  // 저장할 때마다 기존 기록이 고아가 된다 — ON CONFLICT DO UPDATE 형태를 유지해야 한다.
  it('ON CONFLICT(id) DO UPDATE 를 사용하고 REPLACE는 쓰지 않는다', async () => {
    const runAsync = jest.fn().mockResolvedValue(undefined);
    const db = { runAsync } as unknown as SQLiteDatabase;
    const input: Omit<Pet, 'id'> = {
      name: '초코',
      breed: '푸들',
      dob: '2024-02-29',
      sex: '남아',
      neutered: 1,
      photo: 'pet-1.jpg',
    };

    await savePet(db, input);

    expect(runAsync).toHaveBeenCalledTimes(1);
    const [sql, params] = runAsync.mock.calls[0];
    expect(sql).toMatch(/ON CONFLICT\(id\) DO UPDATE/);
    expect(sql).not.toMatch(/REPLACE/i);
    expect(params).toMatchObject({ $id: 1, $name: '초코', $photo: 'pet-1.jpg' });
  });
});
