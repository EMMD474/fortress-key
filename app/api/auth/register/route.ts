import prisma from "@/lib/prismaConnect";
import { NextRequest, NextResponse } from "next/server";
import { hashVerifier } from "@/lib/server/verifier";
import { decodeBundle } from "@/lib/server/wire";
import type { WireSignupBody } from "@/lib/crypto/wire";

// POST /api/auth/register
// Receives only key material produced in the browser (docs/ENCRYPTION_DESIGN.md
// §4.1). The master password, Vault Key, and Recovery Key never reach the
// server — we store the public salt/params, a re-hashed auth verifier, and two
// wrapped copies of the Vault Key as opaque blobs.
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<WireSignupBody>;
    const {
      firstName,
      lastName,
      userName,
      email,
      salt,
      kdfParams,
      authHash,
      wrappedVaultKey,
      wrappedRecoveryKey,
    } = body;

    if (
      !firstName ||
      !userName ||
      !email ||
      !salt ||
      !kdfParams ||
      !authHash ||
      !wrappedVaultKey ||
      !wrappedRecoveryKey
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const vault = decodeBundle(wrappedVaultKey);
    const recovery = decodeBundle(wrappedRecoveryKey);

    await prisma.user.create({
      data: {
        firstName,
        lastName: lastName || null,
        userName,
        email,
        salt: Buffer.from(salt, "base64"),
        kdfParams,
        // Re-hash the high-entropy verifier so a DB leak can't be used to log in.
        authHash: await hashVerifier(authHash),
        wrappedVaultKey: vault.data,
        wrappedVaultKeyIv: vault.iv,
        wrappedVaultKeyTag: vault.tag,
        wrappedRecoveryKey: recovery.data,
        wrappedRecoveryKeyIv: recovery.iv,
        wrappedRecoveryKeyTag: recovery.tag,
      },
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
