import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Resolve the authenticated user's id from the session, or null. Every
// credentials query is scoped by this id so users can only touch their own rows
// (docs/ENCRYPTION_DESIGN.md §5).
export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}
