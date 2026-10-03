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
  it('첫 실행(user_version 0)이면 테이블을 만들고 next_date 컬럼까지 추가해 버전을 2로 올린다', async () => {
    const { db, execAsync, withTransactionAsync } = mockDb(0);

    await migrate(db);

    expect(withTransactionAsync).toHaveBeenCalledTimes(2);
    const createTableCall = execAsync.mock.calls.find(([sql]) => /CREATE TABLE/.test(sql));
    expect(createTableCall).toBeDefined();
    const alterCall = execAsync.mock.calls.find(([sql]) => /ALTER TABLE records ADD COLUMN next_date/.test(sql));
    expect(alterCall).toBeDefined();
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 1');
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 2');
  });

  it('user_version 1이면 ALTER TABLE만 실행해 버전을 2로 올린다', async () => {
    const { db, execAsync, withTransactionAsync } = mockDb(1);

    await migrate(db);

    expect(withTransactionAsync).toHaveBeenCalledTimes(1);
    const createTableCall = execAsync.mock.calls.find(([sql]) => /CREATE TABLE/.test(sql));
    expect(createTableCall).toBeUndefined();
    const alterCall = execAsync.mock.calls.find(([sql]) => /ALTER TABLE records ADD COLUMN next_date/.test(sql));
    expect(alterCall).toBeDefined();
    expect(execAsync).not.toHaveBeenCalledWith('PRAGMA user_version = 1');
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 2');
  });

  it('이미 최신(user_version 2)이면 재실행해도 아무것도 하지 않는다 (멱등)', async () => {
    const { db, execAsync, withTransactionAsync } = mockDb(2);

    await migrate(db);

    expect(withTransactionAsync).not.toHaveBeenCalled();
    const createTableCall = execAsync.mock.calls.find(([sql]) => /CREATE TABLE|ALTER TABLE/.test(sql));
    expect(createTableCall).toBeUndefined();
    expect(execAsync).not.toHaveBeenCalledWith('PRAGMA user_version = 1');
    expect(execAsync).not.toHaveBeenCalledWith('PRAGMA user_version = 2');
  });
});
