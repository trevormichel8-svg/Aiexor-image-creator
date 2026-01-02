"use client"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="p-6 text-center">
      <h2>Something went wrong</h2>
      <button onClick={reset}>Retry</button>
    </div>
  )
}
