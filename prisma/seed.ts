import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@gmail.com' }
  })

  if (existingAdmin) {
    console.log('👤 Admin user already exists, skipping...')
    return
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash('Password@true.com', 10)

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      userName: 'admin',
      email: 'admin@gmail.com',
      masterHash: hashedPassword,
    }
  })

  console.log('✅ Admin user created successfully!')
  console.log(`📧 Email: ${adminUser.email} `)
  console.log(`👤 Username: ${adminUser.userName} `)
  console.log(`🔑 Password: Password @true.com`)

  const defaultCategories = [
    { name: 'Social Media', isDefault: true },
    { name: 'Banking', isDefault: true },
    { name: 'Work', isDefault: true },
    { name: 'Personal', isDefault: true },
  ];

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Default categories seeded successfully.');
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
