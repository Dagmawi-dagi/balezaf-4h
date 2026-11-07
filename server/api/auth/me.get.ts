import { defineEventHandler } from 'h3'
import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const tokenUser = requireAuth(event)

  const user = await prisma.user.findUnique({
    where: { id: tokenUser.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User no longer exists.',
    })
  }

  return {
    success: true,
    user,
  }
})
