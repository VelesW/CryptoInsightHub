import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { config } from "./config.js";

mkdirSync(dirname(config.dbPath), { recursive: true });

export const db = new Database(config.dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    email        TEXT    NOT NULL UNIQUE,
    username     TEXT    NOT NULL UNIQUE,
    password_hash TEXT   NOT NULL,
    created_at   INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );
`);

export interface UserRow {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: number;
}

export const userQueries = {
  findByEmail: db.prepare<[string], UserRow>(
    "SELECT * FROM users WHERE email = ?",
  ),
  findById: db.prepare<[number], UserRow>("SELECT * FROM users WHERE id = ?"),
  insert: db.prepare<[string, string, string]>(
    "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
  ),
};
