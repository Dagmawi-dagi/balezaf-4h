import { defineEventHandler, getQuery } from 'h3'
import { prisma } from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category ? String(query.category) : undefined
  const search = query.search ? String(query.search).trim() : undefined
  const includeDrafts = query.all === 'true'

  // Only authenticated admins can see drafts if explicitly requested
  const user = getUserFromEvent(event)
  const isAuthorizedAdmin = user && user.role === 'ADMIN'

  const whereClause: any = {}

  if (!includeDrafts || !isAuthorizedAdmin) {
    whereClause.isPublished = true
  }

  if (category) {
    whereClause.category = category
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }

  const posts = await prisma.blogPost.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  })

  return {
    success: true,
    data: posts,
  }
})
