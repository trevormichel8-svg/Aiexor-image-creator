import Database from "better-sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "data.sqlite")

export const db = new Database(dbPath)

// Ensure users table exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    credits INTEGER DEFAULT 0
  )
`).run()
