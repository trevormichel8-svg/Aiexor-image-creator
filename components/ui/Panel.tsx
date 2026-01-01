import { ReactNode } from "react"

export function Panel({ children }: { children: ReactNode }) {
  return <div className="surface">{children}</div>
}
