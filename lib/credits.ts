import { cookies } from 'next/headers'

const KEY = 'aiexor_credits'

export function getCredits(): number {
  const c = cookies().get(KEY)?.value
  return c ? parseInt(c, 10) : 0
}

export function addCredits(n: number) {
  const cur = getCredits()
  cookies().set(KEY, String(cur + n), { httpOnly: true, path: '/' })
}

export function consumeCredit(): boolean {
  const cur = getCredits()
  if (cur < 1) return false
  cookies().set(KEY, String(cur - 1), { httpOnly: true, path: '/' })
  return true
}