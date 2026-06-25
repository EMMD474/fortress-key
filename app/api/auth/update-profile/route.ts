import prisma from "@/lib/prismaConnect";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { hashVerifier } from "@/lib/server/verifier";
import { decodeBundle } from "@/lib/server/wire";
import type { WireCipherBundle } from "@/lib/crypto/wire";
import type { KdfParams } from "@/lib/crypto/types";

// PUT /api/auth/update-profile
// Updates profile fields, and optionally rotates the master password. A password
// change is zero-knowledge: the client re-wraps the *existing* Vault Key under
// the new Master Key and sends the new salt/params/verifier/wrappedVaultKey
// (docs/ENCRYPTION_DESIGN.md §2, reason 1). The server never re-encrypts the
// vault and never sees the password.
interface PasswordChange {
  salt: string; // base64
  kdfParams: KdfParams;
  authHash: string;
  wrappedVaultKey: WireCipherBundle;
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, userName, email, passwordChange } = (await req.json()) as {
      firstName?: string;
      lastName?: string | null;
      userName?: string;
      email?: string;
      passwordChange?: PasswordChange;
    };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reject a duplicate email before mutating anything.
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = {
      firstName: firstName || user.firstName,
      lastName: lastName ?? user.lastName,
      userName: userName || user.userName,
      email: email || user.email,
    };

    if (passwordChange) {
      const { salt, kdfParams, authHash, wrappedVaultKey } = passwordChange;
      if (!salt || !kdfParams || !authHash || !wrappedVaultKey) {
        return NextResponse.json({ error: "Incomplete password change" }, { status: 400 });
      }
      const vault = decodeBundle(wrappedVaultKey);
      updateData.salt = Buffer.from(salt, "base64");
      updateData.kdfParams = kdfParams;
      updateData.authHash = await hashVerifier(authHash);
      updateData.wrappedVaultKey = vault.data;
      updateData.wrappedVaultKeyIv = vault.iv;
      updateData.wrappedVaultKeyTag = vault.tag;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
