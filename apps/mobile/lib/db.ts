// 로컬 SQLite 스키마 마이그레이션. PRAGMA user_version 으로 버전을 관리한다.
// 스키마는 docs/harness/BACKEND.md 를 단일 출처로 따른다.
import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'daengdaeng.db';

export async function migrate(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;

  if (version < 1) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS pets (
          id       INTEGER PRIMARY KEY,
          name     TEXT NOT NULL,
          breed    TEXT,
          dob      TEXT,
          sex      TEXT,
          neutered INTEGER,
          photo    TEXT
        );

        CREATE TABLE IF NOT EXISTS records (
          id         INTEGER PRIMARY KEY AUTOINCREMENT,
          pet_id     INTEGER REFERENCES pets(id),
          type       TEXT NOT NULL,
          date       TEXT NOT NULL,
          title      TEXT NOT NULL,
          sub        TEXT,
          notes      TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        );
      `);
    });
    await db.execAsync('PRAGMA user_version = 1');
    version = 1;
  }

  if (version < 2) {
    await db.withTransactionAsync(async () => {
      await db.execAsync('ALTER TABLE records ADD COLUMN next_date TEXT;');
    });
    await db.execAsync('PRAGMA user_version = 2');
    version = 2;
  }

  // 다음 마이그레이션은 이어 붙인다:
  // if (version < 3) { ... await db.execAsync('PRAGMA user_version = 3'); version = 3; }
}
