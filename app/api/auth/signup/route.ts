import { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { sendSuccess } from '@/lib/responseHandler'
import { handleError, handleValidationError } from '@/lib/errorHandler'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  const context = { route: '/api/auth/signup', method: 'POST' }

  try {
    const body = await req.json()
    const { name, email, password } = body ?? {}

    if (!name || !email || !password) {
      return handleValidationError('Name, email, and password are required', context)
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return handleValidationError('User already exists', context)
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }
    })

    logger.info('User registered successfully', {
      route: context.route,
      userId: user.id,
      email: user.email,
    })

    return sendSuccess(user, 'User registered successfully', 201)
  } catch (error) {
    return handleError(error, context)
  }
}
