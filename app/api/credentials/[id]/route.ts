import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaConnect";
import { getSessionUserId } from "@/lib/server/session";
import { updateCredentialSchema } from "@/lib/server/credentialSchemas";
import { encodeBundle } from "@/lib/server/wire";

// Per-credential blob operations. Like the collection route, the server only
// stores and serves opaque ciphertext, always scoped to the owner's userId
// (docs/ENCRYPTION_DESIGN.md §5).

type Context = { params: Promise<{ id: string }> };

// GET /api/credentials/:id — return one credential blob.
export async function GET(_request: NextRequest, { params }: Context) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const credential = await prisma.credential.findFirst({
    where: { id, userId },
    include: { category: true },
  });
  if (!credential) {
    return NextResponse.json({ error: "Credential not found" }, { status: 404 });
  }

  return NextResponse.json({
    credential: {
      id: credential.id,
      label: credential.label,
      ...encodeBundle(credential.encryptedData, credential.iv, credential.tag),
      category: credential.category,
      categoryId: credential.categoryId,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    },
  });
}

// PUT /api/credentials/:id — replace a credential blob.
export async function PUT(request: NextRequest, { params }: Context) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const existing = await prisma.credential.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ error: "Credential not found" }, { status: 404 });
  }

  const parsed = updateCredentialSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { label, encryptedData, iv, tag, categoryId } = parsed.data;

  const updated = await prisma.credential.update({
    where: { id },
    data: {
      label: label ?? existing.label,
      encryptedData: Buffer.from(encryptedData, "base64"),
      iv: Buffer.from(iv, "base64"),
      tag: Buffer.from(tag, "base64"),
      categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
    },
    include: { category: true },
  });

  return NextResponse.json({
    message: "Credential updated",
    credential: {
      id: updated.id,
      label: updated.label,
      category: updated.category,
      updatedAt: updated.updatedAt,
    },
  });
}

// DELETE /api/credentials/:id — remove a credential.
export async function DELETE(_request: NextRequest, { params }: Context) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  // Scope the delete by userId so one user can't delete another's row.
  const result = await prisma.credential.deleteMany({ where: { id, userId } });
  if (result.count === 0) {
    return NextResponse.json({ error: "Credential not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Credential deleted" });
}
