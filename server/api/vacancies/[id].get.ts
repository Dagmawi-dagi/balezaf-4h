import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vacancy ID is required.',
    })
  }

  const vacancy = await prisma.vacancy.findUnique({
    where: { id },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  })

  if (!vacancy) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job vacancy not found.',
    })
  }

  return {
    success: true,
    data: vacancy,
  }
})
