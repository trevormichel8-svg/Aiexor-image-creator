export function requireOpenAIKey() {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("Missing OPENAI_API_KEY")
  return key
}
