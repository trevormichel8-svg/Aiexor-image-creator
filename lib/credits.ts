import { cookies } from "next/headers"
import { db } from "./db"
import { randomUUID } from "crypto"
import { supabaseServer } from "./supabaseServer"

async function getUserId() {
  const supabase = supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    db.prepare(`
      INSERT OR IGNORE INTO users (id, credits)
      VALUES (?, 0)
    `).run(user.id)
    return user.id
  }

  // guest fallback
  const store = cookies()
  let id = store.get("uid")?.value
  if (!id) {
    id = randomUUID()
    store.set("uid", id, { httpOnly: true, path: "/" })
    db.prepare(`INSERT OR IGNORE INTO users (id, credits) VALUES (?, 0)`).run(id)
  }
  return id
}

export async function getCredits() {
  const id = await getUserId()
  const row = db.prepare("SELECT credits FROM users WHERE id=?").get(id)
  return row?.credits ?? 0
}

export async function consumeCredit() {
  const id = await getUserId()
  const row = db.prepare("SELECT credits FROM users WHERE id=?").get(id)
  if (!row || row.credits < 1) return false
  db.prepare("UPDATE users SET credits = credits - 1 WHERE id=?").run(id)
  return true
}
