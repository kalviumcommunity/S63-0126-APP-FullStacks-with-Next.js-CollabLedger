import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body ?? {}

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Missing credentials' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })

    if (!JWT_SECRET) return NextResponse.json({ success: false, message: 'Server misconfiguration' }, { status: 500 })

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })

    return NextResponse.json({ success: true, token }, { status: 200 })
  } catch (_err) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
