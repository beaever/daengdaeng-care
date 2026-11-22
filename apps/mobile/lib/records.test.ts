import { addRecord, deleteRecord, listRecords } from './records';
import { currentPetId, deletePetPhoto } from './pets';
import { rescheduleAll } from './notifications';
import type { SQLiteDatabase } from 'expo-sqlite';

jest.mock('./pets', () => ({ deletePetPhoto: jest.fn(), currentPetId: jest.fn() }));
jest.mock('./notifications', () => ({ rescheduleAll: jest.fn() }));

function mockDb(transaction: () => Promise<void>) {
  return {
    getFirstAsync: jest.fn().mockResolvedValue({ photo: 'walk-1.jpg' }),
    withTransactionAsync: jest.fn(transaction),
  } as unknown as SQLiteDatabase;
}

describe('deleteRecord', () => {
  beforeEach(() => jest.mocked(deletePetPhoto).mockReset());

  // 파일을 먼저 지우도록 바뀌면 DB 삭제 실패 시 사진만 사라진다.
  it('DB 삭제가 실패하면 사진 파일을 지우지 않는다', async () => {
    const db = mockDb(() => Promise.reject(new Error('locked')));
    await expect(deleteRecord(db, 1)).rejects.toThrow('locked');
    expect(deletePetPhoto).not.toHaveBeenCalled();
  });

  it('DB 삭제 후 사진을 지우고, 사진 삭제 실패는 삭제 실패로 보지 않는다', async () => {
    jest.mocked(deletePetPhoto).mockImplementation(() => {
      throw new Error('io');
    });
    const db = mockDb(() => Promise.resolve());
    await expect(deleteRecord(db, 1)).resolves.toBeUndefined();
    expect(deletePetPhoto).toHaveBeenCalledWith('walk-1.jpg');
    expect(rescheduleAll).toHaveBeenCalledWith(db);
  });
});

describe('현재 반려견 id 사용', () => {
  const rec = { type: 'weight', date: '2026-11-17', title: '3.2' } as const;

  it('listRecords·addRecord 가 currentPetId 로 조회·저장한다', async () => {
    jest.mocked(currentPetId).mockResolvedValue(4);
    const db = { getAllAsync: jest.fn().mockResolvedValue([]), runAsync: jest.fn() } as unknown as SQLiteDatabase;
    await listRecords(db);
    await addRecord(db, rec);
    expect(jest.mocked(db.getAllAsync).mock.calls[0][1]).toEqual({ $petId: 4 });
    expect(jest.mocked(db.runAsync).mock.calls[0][1]).toMatchObject({ $petId: 4 });
    expect(rescheduleAll).toHaveBeenCalledWith(db);
  });

  it('반려견이 없으면 listRecords 는 [], addRecord 는 throw', async () => {
    jest.mocked(currentPetId).mockResolvedValue(null);
    const db = { getAllAsync: jest.fn(), runAsync: jest.fn() } as unknown as SQLiteDatabase;
    await expect(listRecords(db)).resolves.toEqual([]);
    await expect(addRecord(db, rec)).rejects.toThrow();
    expect(db.getAllAsync).not.toHaveBeenCalled();
    expect(db.runAsync).not.toHaveBeenCalled();
  });
});
