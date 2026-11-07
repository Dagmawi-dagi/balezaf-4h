import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Application ID is required.',
    })
  }

  const existing = await prisma.vacancyApplication.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Application not found.',
    })
  }

  await prisma.vacancyApplication.delete({
    where: { id },
  })

  return {
    success: true,
    message: 'Application removed successfully.',
  }
})
