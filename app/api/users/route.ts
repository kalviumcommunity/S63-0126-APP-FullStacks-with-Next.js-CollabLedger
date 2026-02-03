import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export async function GET(request: Request) {
  try {
    const auth = request.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null

    if (!token) return NextResponse.json({ success: false, message: 'Missing token' }, { status: 401 })
    if (!JWT_SECRET) return NextResponse.json({ success: false, message: 'Server misconfiguration' }, { status: 500 })

    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (_err) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 })
    }

    return NextResponse.json({ success: true, user: decoded }, { status: 200 })
  } catch (_err) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
