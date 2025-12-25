import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, style } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const fullPrompt = style
      ? `${prompt}, art style: ${style}`
      : prompt;

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: fullPrompt,
        size: "1024x1024",
      }),
    });

    const data = await res.json();

    const image = data.data?.[0]?.b64_json;
    if (!image) {
      return NextResponse.json({ error: "No image returned" }, { status: 500 });
    }

    return NextResponse.json({
      image: `data:image/png;base64,${image}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
