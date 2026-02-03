import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function run() {
  try {
    console.log('Adding password column to User table (if missing)')
    await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" TEXT;')
    console.log('Done')
  } catch (err) {
    console.error('Error adding column:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

run()
