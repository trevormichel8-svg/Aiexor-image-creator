import { getUserCredits } from "@/lib/db/credits";
import { getUserFromSession } from "@/lib/auth";

export async function GET() {
  const user = await getUserFromSession();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const credits = await getUserCredits(user.id);
  return Response.json({ credits });
}
