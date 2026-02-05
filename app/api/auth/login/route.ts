import { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { sendSuccess } from '@/lib/responseHandler'
import { handleError, handleValidationError, handleNotFound } from '@/lib/errorHandler'
import { logger } from '@/lib/logger'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req: NextRequest) {
  const context = { route: '/api/auth/login', method: 'POST' }

  try {
    const body = await req.json()
    const { email, password } = body ?? {}

    if (!email || !password) {
      return handleValidationError('Email and password are required', context)
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      return handleNotFound('User', { ...context, email })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return handleValidationError('Invalid credentials', context)
    }

    if (!JWT_SECRET) {
      return handleError(new Error('JWT_SECRET not configured'), context)
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })

    logger.info('User logged in successfully', {
      route: context.route,
      userId: user.id,
      email: user.email,
    })

    return sendSuccess({ token, user: { id: user.id, email: user.email, name: user.name } }, 'Login successful', 200)
  } catch (error) {
    return handleError(error, context)
  }
}
