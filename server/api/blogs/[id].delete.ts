import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required.',
    })
  }

  const existing = await prisma.blogPost.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Blog post not found.',
    })
  }

  await prisma.blogPost.delete({
    where: { id },
  })

  return {
    success: true,
    message: 'Blog post deleted successfully.',
  }
})
