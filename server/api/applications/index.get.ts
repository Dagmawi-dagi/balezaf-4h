import { defineEventHandler, getQuery } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const vacancyId = query.vacancyId ? String(query.vacancyId) : undefined
  const status = query.status ? String(query.status) : undefined

  const whereClause: any = {}

  if (vacancyId) {
    whereClause.vacancyId = vacancyId
  }

  if (status) {
    whereClause.status = status
  }

  const applications = await prisma.vacancyApplication.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      vacancy: {
        select: {
          id: true,
          title: true,
          team: true,
          status: true,
        },
      },
    },
  })

  return {
    success: true,
    data: applications,
  }
})
