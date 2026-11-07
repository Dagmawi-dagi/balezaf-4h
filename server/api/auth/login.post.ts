import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'
import { signUserToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body || {}

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required.',
    })
  }

  const user = await prisma.user.findUnique({
    where: { email: String(email).trim().toLowerCase() },
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password.',
    })
  }

  const isPasswordValid = await bcrypt.compare(String(password), user.passwordHash)
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password.',
    })
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  }

  const token = signUserToken(tokenPayload)

  // Set HTTP-only secure cookie
  setCookie(event, 'balezaf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return {
    success: true,
    user: tokenPayload,
    token,
  }
})
