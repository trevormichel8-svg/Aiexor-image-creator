import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params, _modelId }: { params: unknown; _modelId?: unknown }
) {
  const body = await req.json();

  return NextResponse.json({
    image: body.image,
    provider: body.provider,
  });
}
