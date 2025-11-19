import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@/lib/generated/prisma';
import crypto from 'crypto';

const prisma = new PrismaClient();

// GET - Fetch a specific credential
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const credential = await prisma.credential.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
      include: {
        category: true,
      },
    });

    if (!credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
    }

    // In a real implementation, decrypt the credential data here
    const decryptedCredential = {
      id: credential.id,
      label: credential.label,
      username: 'decrypted_username',
      password: 'decrypted_password',
      website: 'decrypted_website',
      notes: 'decrypted_notes',
      category: credential.category,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    };

    return NextResponse.json({ credential: decryptedCredential });
  } catch (error) {
    console.error('Error fetching credential:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update a credential
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { label, username, password, website, notes, categoryId, masterPassword } = body;

    // Verify the credential belongs to the user
    const existingCredential = await prisma.credential.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingCredential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
    }

    // In a real implementation, verify master password and encrypt data
    const credentialData = JSON.stringify({
      username: username || '',
      password: password || '',
      website: website || '',
      notes: notes || '',
    });

    const mockEncrypted = Buffer.from(credentialData, 'utf8');
    const mockIv = crypto.randomBytes(16);

    const updatedCredential = await prisma.credential.update({
      where: { id: params.id },
      data: {
        label: label || existingCredential.label,
        encryptedData: mockEncrypted,
        iv: mockIv,
        categoryId: categoryId !== undefined ? categoryId : existingCredential.categoryId,
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ 
      message: 'Credential updated successfully',
      credential: {
        id: updatedCredential.id,
        label: updatedCredential.label,
        category: updatedCredential.category,
        updatedAt: updatedCredential.updatedAt,
      }
    });
  } catch (error) {
    console.error('Error updating credential:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a credential
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the credential belongs to the user
    const credential = await prisma.credential.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    });

    if (!credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
    }

    await prisma.credential.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Credential deleted successfully' });
  } catch (error) {
    console.error('Error deleting credential:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
