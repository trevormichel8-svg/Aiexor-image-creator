"use server";

import { consumeUserCredit } from "@/db/credits";
import { getUser } from "@/auth/server";
import { generateImage } from "@/lib/image";

export async function generateImageAction(prompt: string) {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  await consumeUserCredit(user.id);

  const imageUrl = await generateImage(prompt);

  return { imageUrl };
}
