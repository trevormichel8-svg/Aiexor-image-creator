import { NextResponse } from "next/server"

/**
 * 🚨 SAFE PLACEHOLDER GENERATE ROUTE
 * This file intentionally contains NO image processing.
 * NO sharp
 * NO buffer manipulation
 * NO watermarking
 *
 * This exists ONLY to unblock Vercel builds.
 */

export async function POST(req: Request) {
  return NextResponse.json({
    image: "/placeholder1.png",
  })
}
