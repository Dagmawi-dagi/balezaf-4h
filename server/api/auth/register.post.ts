import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // Only authenticated admins can register new staff/admin accounts
  requireAdmin(event)

  const body = await readBody(event)
  const { email, password, fullName, role } = body || {}

  if (!email || !password || !fullName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email, password, and full name are required.',
    })
  }

  const normalizedEmail = String(email).trim().toLowerCase()

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'A user with this email already exists.',
    })
  }

  const passwordHash = await bcrypt.hash(String(password), 10)

  const newUser = await prisma.user.create({
    data: {
      email: normalizedEmail,
      fullName: String(fullName).trim(),
      passwordHash,
      role: role === 'EDITOR' ? 'EDITOR' : 'ADMIN',
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  })

  return {
    success: true,
    user: newUser,
  }
})
