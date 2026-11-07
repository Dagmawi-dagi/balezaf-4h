import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { prisma } from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/auth'

const VALID_STATUSES = ['PENDING', 'REVIEWING', 'INTERVIEWED', 'ACCEPTED', 'REJECTED'] as const

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Application ID is required.',
    })
  }

  const body = await readBody(event)
  const { status } = body || {}

  if (!status || !VALID_STATUSES.includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
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

  const updated = await prisma.vacancyApplication.update({
    where: { id },
    data: { status },
    include: {
      vacancy: {
        select: {
          id: true,
          title: true,
          team: true,
        },
      },
    },
  })

  return {
    success: true,
    data: updated,
  }
})
