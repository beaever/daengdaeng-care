import { migrate } from './db';
import type { SQLiteDatabase } from 'expo-sqlite';

function mockDb(initialVersion: number) {
  const execAsync = jest.fn().mockResolvedValue(undefined);
  const withTransactionAsync = jest.fn((fn: () => Promise<void>) => fn());
  const getFirstAsync = jest.fn().mockResolvedValue({ user_version: initialVersion });
  const db = { execAsync, getFirstAsync, withTransactionAsync } as unknown as SQLiteDatabase;
  return { db, execAsync, withTransactionAsync };
}

describe('migrate', () => {
  it('첫 실행(user_version 0)이면 트랜잭션 안에서 테이블을 만들고 버전을 1로 올린다', async () => {
    const { db, execAsync, withTransactionAsync } = mockDb(0);

    await migrate(db);

    expect(withTransactionAsync).toHaveBeenCalledTimes(1);
    const createTableCall = execAsync.mock.calls.find(([sql]) => /CREATE TABLE/.test(sql));
    expect(createTableCall).toBeDefined();
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 1');
  });

  it('이미 마이그레이션된 DB(user_version >= 1)면 재실행해도 아무것도 하지 않는다 (멱등)', async () => {
    const { db, execAsync, withTransactionAsync } = mockDb(1);

    await migrate(db);

    expect(withTransactionAsync).not.toHaveBeenCalled();
    const createTableCall = execAsync.mock.calls.find(([sql]) => /CREATE TABLE/.test(sql));
    expect(createTableCall).toBeUndefined();
    expect(execAsync).not.toHaveBeenCalledWith('PRAGMA user_version = 1');
  });
});
