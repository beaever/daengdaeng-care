import { deleteRecord } from './records';
import { deletePetPhoto } from './pets';
import type { SQLiteDatabase } from 'expo-sqlite';

jest.mock('./pets', () => ({ deletePetPhoto: jest.fn() }));

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
  });
});
