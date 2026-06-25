import { PrismaClient } from '@prisma/client'
import { createSignupKeyMaterial } from '../lib/crypto/vault'
import { formatRecoveryKey } from '../lib/crypto/recoveryKey'
import { hashVerifier } from '../lib/server/verifier'

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'admin@fortress-key.com'
const ADMIN_PASSWORD = 'Password@true.com'

async function main() {
  console.log('🌱 Starting database seeding...')

  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  })

  if (existingAdmin) {
    console.log('👤 Admin user already exists, skipping...')
  } else {
    // Produce the same key material the browser would at signup, then store the
    // re-hashed verifier and wrapped keys — exactly like the register route.
    const material = await createSignupKeyMaterial(ADMIN_PASSWORD)

    const adminUser = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: ADMIN_EMAIL,
        salt: Buffer.from(material.salt),
        kdfParams: material.kdfParams,
        authHash: await hashVerifier(material.authHash),
        wrappedVaultKey: Buffer.from(material.wrappedVaultKey.ciphertext),
        wrappedVaultKeyIv: Buffer.from(material.wrappedVaultKey.iv),
        wrappedVaultKeyTag: Buffer.from(material.wrappedVaultKey.tag),
        wrappedRecoveryKey: Buffer.from(material.wrappedRecoveryKey.ciphertext),
        wrappedRecoveryKeyIv: Buffer.from(material.wrappedRecoveryKey.iv),
        wrappedRecoveryKeyTag: Buffer.from(material.wrappedRecoveryKey.tag),
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log(`📧 Email: ${adminUser.email}`)
    console.log(`🔑 Master password: ${ADMIN_PASSWORD}`)
    console.log(`🛟 Recovery key (dev only): ${formatRecoveryKey(material.recoveryKey)}`)
  }

  const defaultCategories = [
    { name: 'Social Media', isDefault: true },
    { name: 'Banking', isDefault: true },
    { name: 'Work', isDefault: true },
    { name: 'Personal', isDefault: true },
  ]

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  console.log('✅ Default categories seeded successfully.')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  })
