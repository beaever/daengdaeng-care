import { savePet, deletePet, photoUri, type Pet } from './pets';
import { File } from 'expo-file-system';
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

const input: Omit<Pet, 'id'> = {
  name: '초코',
  breed: '푸들',
  dob: '2024-02-29',
  sex: '남아',
  neutered: 1,
  photo: 'pet-1.jpg',
};

describe('savePet', () => {
  // records.pet_id FK가 걸려 있어 INSERT OR REPLACE(delete+insert)로 회귀하면
  // 저장할 때마다 기존 기록이 고아가 된다 — ON CONFLICT DO UPDATE 형태를 유지해야 한다.
  it('id 가 있으면 ON CONFLICT(id) DO UPDATE 를 사용하고 REPLACE는 쓰지 않는다', async () => {
    const runAsync = jest.fn().mockResolvedValue(undefined);
    const db = { runAsync } as unknown as SQLiteDatabase;

    await savePet(db, input, 3);

    expect(runAsync).toHaveBeenCalledTimes(1);
    const [sql, params] = runAsync.mock.calls[0];
    expect(sql).toMatch(/ON CONFLICT\(id\) DO UPDATE/);
    expect(sql).not.toMatch(/REPLACE/i);
    expect(params).toMatchObject({ $id: 3, $name: '초코', $photo: 'pet-1.jpg' });
  });

  it('id 가 없으면 INSERT 후 새 id 를 current_pet_id 로 지정한다', async () => {
    const runAsync = jest.fn().mockResolvedValue({ lastInsertRowId: 9, changes: 1 });
    const db = { runAsync } as unknown as SQLiteDatabase;

    await expect(savePet(db, input)).resolves.toBe(9);

    expect(runAsync).toHaveBeenCalledTimes(2);
    expect(runAsync.mock.calls[0][0]).toMatch(/INSERT INTO pets \(name/);
    expect(runAsync.mock.calls[1][0]).toMatch(/current_pet_id/);
    expect(runAsync.mock.calls[1][1]).toEqual({ $v: '9' });
  });
});

describe('deletePet', () => {
  const deleted: string[] = [];
  const order: string[] = [];

  function mockDb(tx: () => Promise<void> = () => Promise.resolve()) {
    return {
      getFirstAsync: jest.fn().mockResolvedValue({ photo: 'pet-1.jpg' }),
      getAllAsync: jest.fn().mockResolvedValue([{ photo: 'walk-1.jpg' }]),
      runAsync: jest.fn(async (q: string) => void order.push(q)),
      withTransactionAsync: jest.fn(async (fn: () => Promise<void>) => {
        await tx();
        await fn();
        order.push('commit');
      }),
    } as unknown as SQLiteDatabase;
  }

  beforeEach(() => {
    deleted.length = 0;
    order.length = 0;
    jest.spyOn(File.prototype, 'exists', 'get').mockReturnValue(true);
    jest.spyOn(File.prototype, 'delete').mockImplementation(function (this: { uri: string }) {
      order.push('file');
      deleted.push(this.uri);
    });
  });
  afterEach(() => jest.restoreAllMocks());

  it('walk_points → records → pets → settings 순으로 한 트랜잭션에서 지우고, 파일은 커밋 뒤에 지운다', async () => {
    await deletePet(mockDb(), 2);

    expect(order[0]).toMatch(/DELETE FROM walk_points WHERE record_id IN/);
    expect(order[1]).toMatch(/DELETE FROM records/);
    expect(order[2]).toMatch(/DELETE FROM pets/);
    expect(order[3]).toMatch(/DELETE FROM settings/);
    expect(order.slice(4)).toEqual(['commit', 'file', 'file']);
    expect(deleted).toHaveLength(2);
  });

  it('진행 중 포인트(record_id IS NULL)는 지우지 않는다', async () => {
    await deletePet(mockDb(), 2);
    expect(order.join('\n')).not.toMatch(/record_id IS NULL/);
    expect(order[0]).toMatch(/record_id IN \(SELECT id FROM records WHERE pet_id/);
  });

  it('DB 삭제가 실패하면 파일을 지우지 않는다', async () => {
    await expect(deletePet(mockDb(() => Promise.reject(new Error('locked'))), 2)).rejects.toThrow('locked');
    expect(deleted).toHaveLength(0);
  });

  it('파일 삭제가 실패해도 throw 하지 않고 나머지 파일을 계속 지운다', async () => {
    const del = jest.spyOn(File.prototype, 'delete').mockImplementation(() => {
      throw new Error('io');
    });
    await expect(deletePet(mockDb(), 2)).resolves.toBeUndefined();
    expect(del).toHaveBeenCalledTimes(2);
  });
});
