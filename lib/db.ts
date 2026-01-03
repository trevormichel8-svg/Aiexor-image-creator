
import Database from 'better-sqlite3'

export const db = new Database('credits.db')

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    credits INTEGER NOT NULL
  )
`).run()
