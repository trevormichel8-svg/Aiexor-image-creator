
import { cookies } from 'next/headers'
import { db } from './db'
import { randomUUID } from 'crypto'

function getUserId() {
  const store = cookies()
  let id = store.get('uid')?.value
  if (!id) {
    id = randomUUID()
    store.set('uid', id, { httpOnly: true, path: '/' })
    db.prepare('INSERT OR IGNORE INTO users (id, credits) VALUES (?, 0)').run(id)
  }
  return id
}

export function getCredits() {
  const id = getUserId()
  const row = db.prepare('SELECT credits FROM users WHERE id=?').get(id)
  return row?.credits ?? 0
}

export function addCredits(n: number) {
  const id = getUserId()
  db.prepare('UPDATE users SET credits = credits + ? WHERE id=?').run(n, id)
}

export function consumeCredit() {
  const id = getUserId()
  const cur = getCredits()
  if (cur < 1) return false
  db.prepare('UPDATE users SET credits = credits - 1 WHERE id=?').run(id)
  return true
}
