import prisma from "@/lib/prismaConnect";
import { NextResponse, NextRequest } from "next/server";
import { hashVerifier } from "@/lib/server/verifier";
import { decodeBundle } from "@/lib/server/wire";
import type { WireRecoveryBody } from "@/lib/crypto/wire";

// POST /api/auth/reset-password
// Completes a recovery (docs/ENCRYPTION_DESIGN.md §4.3). The client has already
// used the Recovery Key to unwrap the Vault Key and re-wrapped it under a brand
// new master password. We just persist the new public salt/params, the new
// verifier, and the newly wrapped Vault Key — all opaque. No plaintext, no OTP.
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<WireRecoveryBody>;
    const { email, salt, kdfParams, authHash, wrappedVaultKey } = body;

    if (!email || !salt || !kdfParams || !authHash || !wrappedVaultKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      // Don't disclose whether the account exists.
      return NextResponse.json({ error: "Recovery failed" }, { status: 400 });
    }

    const vault = decodeBundle(wrappedVaultKey);

    await prisma.user.update({
      where: { email },
      data: {
        salt: Buffer.from(salt, "base64"),
        kdfParams,
        authHash: await hashVerifier(authHash),
        wrappedVaultKey: vault.data,
        wrappedVaultKeyIv: vault.iv,
        wrappedVaultKeyTag: vault.tag,
      },
    });

    return NextResponse.json({ message: "Password reset successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
