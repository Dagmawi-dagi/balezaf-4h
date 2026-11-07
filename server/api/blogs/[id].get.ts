import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const idOrSlug = getRouterParam(event, 'id')

  if (!idOrSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID or slug is required.',
    })
  }

  // Look up by ID or by slug
  const post = await prisma.blogPost.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  })

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Blog post not found.',
    })
  }

  return {
    success: true,
    data: post,
  }
})
