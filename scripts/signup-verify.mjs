import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function trySignup(base) {
  const ts = Date.now()
  const email = `test+signup${ts}@example.com`
  const password = `P@ssw0rd!${ts}`
  const name = 'Automated Test'

  console.log('Trying signup at', base, 'for', email)

  try {
    const res = await fetch(`${base}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    const text = await res.text()
    console.log('Signup response status:', res.status)
    console.log(text)

    if (res.status === 201) {
      const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, name: true, createdAt: true } })
      console.log('User in DB:', user)
    }

    return true
  } catch (err) {
    console.error('Signup attempt failed at', base, err?.message || err)
    return false
  }
}

async function run() {
  const bases = [process.env.BASE_URL || 'http://localhost:3000', 'http://localhost:3001']
  for (const base of bases) {
    const ok = await trySignup(base)
    if (ok) break
  }
  await prisma.$disconnect()
}

run().catch(err => { console.error(err); process.exit(1) })
