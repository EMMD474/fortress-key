import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaConnect";
import { getSessionUserId } from "@/lib/server/session";
import { createCredentialSchema } from "@/lib/server/credentialSchemas";
import { encodeBundle } from "@/lib/server/wire";

// Credentials API — a dumb, secure blob store (docs/ENCRYPTION_DESIGN.md §5).
// The server verifies the session, scopes every query by userId, and stores or
// returns opaque ciphertext. It never derives keys or decrypts anything; all
// crypto happens in the browser.

// GET /api/credentials — list the caller's credential blobs.
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const credentials = await prisma.credential.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    credentials: credentials.map((c) => ({
      id: c.id,
      label: c.label,
      ...encodeBundle(c.encryptedData, c.iv, c.tag),
      category: c.category,
      categoryId: c.categoryId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
  });
}

// POST /api/credentials — store a new credential blob.
export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createCredentialSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { label, encryptedData, iv, tag, categoryId } = parsed.data;

  const credential = await prisma.credential.create({
    data: {
      label,
      encryptedData: Buffer.from(encryptedData, "base64"),
      iv: Buffer.from(iv, "base64"),
      tag: Buffer.from(tag, "base64"),
      userId,
      categoryId: categoryId ?? null,
    },
    include: { category: true },
  });

  return NextResponse.json(
    {
      message: "Credential created",
      credential: {
        id: credential.id,
        label: credential.label,
        category: credential.category,
        createdAt: credential.createdAt,
      },
    },
    { status: 201 },
  );
}
