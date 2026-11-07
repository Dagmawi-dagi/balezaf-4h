import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vacancy ID is required.',
    })
  }

  const existing = await prisma.vacancy.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job vacancy not found.',
    })
  }

  await prisma.vacancy.delete({
    where: { id },
  })

  return {
    success: true,
    message: 'Vacancy deleted successfully.',
  }
})
