import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function run() {
  const ts = Date.now()
  const email = `test+prismatest${ts}@example.com`
  try {
    const user = await prisma.user.create({ data: { email, name: 'Prisma Test' } })
    console.log('Created user:', user)
  } catch (err) {
    console.error('Prisma create error:', err)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

run()
