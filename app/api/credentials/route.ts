import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@/lib/generated/prisma';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Encryption utilities
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;

function deriveKey(masterPassword: string, salt: string): Buffer {
  return crypto.pbkdf2Sync(masterPassword, salt, 100000, KEY_LENGTH, 'sha256');
}

function encryptData(data: string, key: Buffer): { encrypted: Buffer; iv: Buffer; tag: Buffer } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, key);
  
  let encrypted = cipher.update(data, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  const tag = cipher.getAuthTag();
  
  return { encrypted, iv, tag };
}

function decryptData(encryptedData: Buffer, iv: Buffer, tag: Buffer, key: Buffer): string {
  const decipher = crypto.createDecipher(ALGORITHM, key);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encryptedData, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// GET - Fetch all credentials for the authenticated user
export async function GET(request: NextRequest) {
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

    const credentials = await prisma.credential.findMany({
      where: { userId: user.id },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Note: In a real implementation, you would decrypt the credentials here
    // For now, we'll return mock decrypted data
    const decryptedCredentials = credentials.map(credential => ({
      id: credential.id,
      label: credential.label,
      username: 'encrypted_username', // Would be decrypted
      password: 'encrypted_password', // Would be decrypted
      website: 'encrypted_website', // Would be decrypted
      notes: 'encrypted_notes', // Would be decrypted
      category: credential.category,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    }));

    return NextResponse.json({ credentials: decryptedCredentials });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new credential
export async function POST(request: NextRequest) {
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

    if (!label || !password) {
      return NextResponse.json({ error: 'Label and password are required' }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Verify the master password
    // 2. Derive encryption key from master password
    // 3. Encrypt the credential data

    // For now, we'll create a mock encrypted credential
    const credentialData = JSON.stringify({
      username: username || '',
      password,
      website: website || '',
      notes: notes || '',
    });

    // Mock encryption - in reality, use proper encryption
    const mockEncrypted = Buffer.from(credentialData, 'utf8');
    const mockIv = crypto.randomBytes(16);

    const credential = await prisma.credential.create({
      data: {
        label,
        encryptedData: mockEncrypted,
        iv: mockIv,
        userId: user.id,
        categoryId: categoryId || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ 
      message: 'Credential created successfully',
      credential: {
        id: credential.id,
        label: credential.label,
        category: credential.category,
        createdAt: credential.createdAt,
      }
    });
  } catch (error) {
    console.error('Error creating credential:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
