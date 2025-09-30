import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";

export type Connection = Database;

let db: Connection | undefined;

export type Info = {
  value: number;
};

export async function getDb() {
  if (!db) {
    // @ts-expect-error globalThis may have __db__
    db = globalThis.__db__ as Connection | undefined;
  }

  if (!db) {
    const filename = "db.sqlite";
    db = await open({
      filename,
      driver: sqlite3.Database,
    });

    const versionResult = await db.get<{ user_version: number }>(`PRAGMA user_version;`);

    if ((versionResult?.user_version ?? 0) === 0) {
      // create schema
      await db.exec(`
                CREATE TABLE IF NOT EXISTS info (
                    value INTEGER NOT NULL
                );
                INSERT INTO info (value) VALUES (0);
                PRAGMA user_version = 1;
            `);
    }
  }
  // @ts-expect-error store into global __db__
  globalThis.__db__ = db;
  return db;
}

export async function endDb() {
  if (!db) {
    // @ts-expect-error globalThis may have __db__
    db = globalThis.__db__ as Connection | undefined;
  }

  if (db) {
    await db.close();
    // @ts-expect-error globalThis may have __db__
    globalThis.__db__ = db = undefined;
  }
}

export async function getInfo(): Promise<Info | undefined> {
  const db = await getDb();
  const info = await db.get<{ value: number }>("SELECT value FROM info" );
  return info satisfies (Info | undefined);
}

export async function increaseInfo(): Promise<void> {
  const db = await getDb();
  await db.exec(`UPDATE info SET value = value + 1`);
}

export async function resetInfo(): Promise<void> {
  const db = await getDb();
  await db.exec(`UPDATE info SET value = 0`);
}
