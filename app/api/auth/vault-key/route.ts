import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import prisma from "@/lib/prismaConnect";
import { encodeBundle } from "@/lib/server/wire";

// GET /api/auth/vault-key
// Returns the caller's Vault Key wrapped under their Master Key. The blob is
// useless without the Master Key (which only the browser can derive), but we
// still gate it behind an authenticated session. The client unwraps it locally
// to unlock the vault (docs/ENCRYPTION_DESIGN.md §4.2, step 4).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { wrappedVaultKey: true, wrappedVaultKeyIv: true, wrappedVaultKeyTag: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    wrappedVaultKey: encodeBundle(
      user.wrappedVaultKey,
      user.wrappedVaultKeyIv,
      user.wrappedVaultKeyTag,
    ),
  });
}
