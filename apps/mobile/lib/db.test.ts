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
  it('첫 실행(user_version 0)이면 테이블을 만들고 next_date·photo 컬럼, walk_points 까지 추가해 버전을 4로 올린다', async () => {
    const { db, execAsync, withTransactionAsync } = mockDb(0);

    await migrate(db);

    expect(withTransactionAsync).toHaveBeenCalledTimes(4);
    const createTableCall = execAsync.mock.calls.find(([sql]) => /CREATE TABLE/.test(sql));
    expect(createTableCall).toBeDefined();
    const alterCall = execAsync.mock.calls.find(([sql]) => /ALTER TABLE records ADD COLUMN next_date/.test(sql));
    expect(alterCall).toBeDefined();
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 1');
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 2');
    expect(execAsync).toHaveBeenCalledWith('ALTER TABLE records ADD COLUMN photo TEXT;');
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 3');
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 4');
  });

  it('user_version 1이면 ALTER TABLE만 실행해 버전을 4로 올린다', async () => {
    const { db, execAsync, withTransactionAsync } = mockDb(1);

    await migrate(db);

    expect(withTransactionAsync).toHaveBeenCalledTimes(3);
    const createTableCall = execAsync.mock.calls.find(([sql]) => /CREATE TABLE IF NOT EXISTS (pets|records)/.test(sql));
    expect(createTableCall).toBeUndefined();
    const alterCall = execAsync.mock.calls.find(([sql]) => /ALTER TABLE records ADD COLUMN next_date/.test(sql));
    expect(alterCall).toBeDefined();
    expect(execAsync).not.toHaveBeenCalledWith('PRAGMA user_version = 1');
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 2');
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 3');
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 4');
  });

  it('user_version 2이면 photo 컬럼·walk_points 를 추가해 버전을 4로 올린다', async () => {
    const { db, execAsync, withTransactionAsync } = mockDb(2);

    await migrate(db);

    expect(withTransactionAsync).toHaveBeenCalledTimes(2);
    expect(execAsync).toHaveBeenCalledWith('ALTER TABLE records ADD COLUMN photo TEXT;');
    expect(execAsync).not.toHaveBeenCalledWith('PRAGMA user_version = 2');
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 3');
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 4');
  });

  it('user_version 3이면 walk_points 테이블·인덱스만 만들고 버전을 4로 올린다', async () => {
    const { db, execAsync, withTransactionAsync } = mockDb(3);

    await migrate(db);

    expect(withTransactionAsync).toHaveBeenCalledTimes(1);
    const sql = execAsync.mock.calls.map(([q]) => q).join('\n');
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS walk_points/);
    expect(sql).toMatch(/CREATE INDEX IF NOT EXISTS idx_walk_points_record/);
    expect(sql).not.toMatch(/ALTER TABLE/);
    expect(execAsync).toHaveBeenCalledWith('PRAGMA user_version = 4');
    expect(execAsync).not.toHaveBeenCalledWith('PRAGMA user_version = 3');
  });

  it('user_version 은 스키마 변경과 같은 트랜잭션 안에서 올린다 (중간에 앱이 죽어도 어긋나지 않게)', async () => {
    const { db, execAsync, withTransactionAsync } = mockDb(0);
    let inTx = false;
    const pragmaInTx: boolean[] = [];
    withTransactionAsync.mockImplementation(async (fn: () => Promise<void>) => {
      inTx = true;
      await fn();
      inTx = false;
    });
    execAsync.mockImplementation(async (sql: string) => {
      if (/PRAGMA user_version = /.test(sql)) pragmaInTx.push(inTx);
    });

    await migrate(db);

    expect(pragmaInTx).toEqual([true, true, true, true]);
  });

  it('이미 최신(user_version 4)이면 재실행해도 아무것도 하지 않는다 (멱등)', async () => {
    const { db, execAsync, withTransactionAsync } = mockDb(4);

    await migrate(db);

    expect(withTransactionAsync).not.toHaveBeenCalled();
    const createTableCall = execAsync.mock.calls.find(([sql]) => /CREATE TABLE|ALTER TABLE/.test(sql));
    expect(createTableCall).toBeUndefined();
    expect(execAsync).not.toHaveBeenCalledWith('PRAGMA user_version = 1');
    expect(execAsync).not.toHaveBeenCalledWith('PRAGMA user_version = 2');
    expect(execAsync).not.toHaveBeenCalledWith('PRAGMA user_version = 3');
    expect(execAsync).not.toHaveBeenCalledWith('PRAGMA user_version = 4');
  });
});
