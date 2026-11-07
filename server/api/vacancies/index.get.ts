import { defineEventHandler, getQuery } from 'h3'
import { prisma } from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const includeClosed = query.all === 'true'

  const user = getUserFromEvent(event)
  const isAuthorizedAdmin = user && user.role === 'ADMIN'

  const whereClause: any = {}

  if (!includeClosed || !isAuthorizedAdmin) {
    whereClause.status = 'OPEN'
  }

  const vacancies = await prisma.vacancy.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  })

  // Format with position_name compatibility
  const formatted = vacancies.map((v) => ({
    ...v,
    position_name: v.positionName || v.title,
    locations: v.locations && v.locations.length > 0 ? v.locations : [v.location || 'Addis Ababa'],
    company: v.company || 'BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
    salary: v.salary || 'based in the company scale',
    deadline: v.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    requirements: v.requirements || '<p>Proven experience and strong work ethic.</p>',
  }))

  return {
    success: true,
    data: formatted,
  }
})
