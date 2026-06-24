import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import prisma from "@/lib/prismaConnect";
import { encodeBundle } from "@/lib/server/wire";
import { KEY_BYTES, IV_BYTES, TAG_BYTES } from "@/lib/crypto/constants";

// GET /api/auth/recovery-material?email=...
// Returns the Vault Key wrapped under the Recovery Key, so a user who forgot
// their master password can recover client-side (docs/ENCRYPTION_DESIGN.md
// §4.3). The blob is opaque ciphertext; only the user's saved Recovery Key can
// unwrap it. Unknown emails get a deterministic decoy so a wrong recovery key
// and a non-existent account are indistinguishable (no enumeration).

function decoyRecoveryBundle(email: string) {
  const secret = process.env.NEXTAUTH_SECRET || "fortress-key-dev-secret";
  const stretch = (label: string, len: number) => {
    const out = Buffer.alloc(len);
    let block = createHmac("sha256", secret).update(`${label}:${email.toLowerCase()}`).digest();
    let offset = 0;
    while (offset < len) {
      const take = Math.min(block.length, len - offset);
      block.copy(out, offset, 0, take);
      offset += take;
      block = createHmac("sha256", secret).update(block).digest();
    }
    return out;
  };
  return encodeBundle(
    stretch("rk-ct", KEY_BYTES),
    stretch("rk-iv", IV_BYTES),
    stretch("rk-tag", TAG_BYTES),
  );
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { wrappedRecoveryKey: true, wrappedRecoveryKeyIv: true, wrappedRecoveryKeyTag: true },
  });

  const wrappedRecoveryKey = user
    ? encodeBundle(user.wrappedRecoveryKey, user.wrappedRecoveryKeyIv, user.wrappedRecoveryKeyTag)
    : decoyRecoveryBundle(email);

  return NextResponse.json({ wrappedRecoveryKey });
}
