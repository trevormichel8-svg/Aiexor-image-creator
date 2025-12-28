export function compilePrompt(
  userPrompt: string,
  style: string,
  strength: number
): string {
  if (!style || style === "Default") return userPrompt;

  const weight =
    strength >= 80
      ? "very strong"
      : strength >= 60
      ? "strong"
      : strength >= 40
      ? "moderate"
      : "subtle";

  const styleDescriptors: Record<string, string> = {
    Cinematic:
      "cinematic lighting, dramatic composition, film still, epic atmosphere",
    Photorealistic:
      "photorealistic, ultra-detailed, sharp focus, real-world lighting",
    Anime:
      "anime style, clean line art, vibrant colors, studio quality",
    Cyberpunk:
      "cyberpunk aesthetic, neon lights, futuristic, dark cityscape",
    Fantasy:
      "fantasy art, epic scale, magical atmosphere, detailed illustration",
    "Oil Painting":
      "oil painting, textured brush strokes, classical art style",
  };

  const styleText =
    styleDescriptors[style] ??
    `${style} art style, highly detailed, professional quality`;

  return `${userPrompt}, ${styleText}, ${weight} stylistic influence`;
}
