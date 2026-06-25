import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaConnect';
import { resolveSaltParams } from '@/lib/server/saltParams';
import { bytesToBase64 } from '@/lib/crypto/encoding';

// GET /api/auth/salt?email=...
// Returns the public Argon2id inputs (salt + params) the browser needs before
// it can derive the Master Key. Non-secret by design (docs/ENCRYPTION_DESIGN.md
// §1, §4.2). Answers uniformly for unknown emails to avoid user enumeration.
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { salt: true, kdfParams: true },
  });

  const { salt, kdfParams } = resolveSaltParams(
    user ? { salt: user.salt, kdfParams: user.kdfParams } : null,
    email,
  );

  return NextResponse.json({ salt: bytesToBase64(salt), kdfParams });
}
