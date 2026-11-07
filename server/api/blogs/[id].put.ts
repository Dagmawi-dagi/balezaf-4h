import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
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

  const body = await readBody(event)
  const { title, category, excerpt, content, imageUrl, isPublished } = body || {}

  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      ...(title !== undefined && { title: String(title).trim() }),
      ...(category !== undefined && { category: String(category).trim() }),
      ...(excerpt !== undefined && { excerpt: excerpt ? String(excerpt).trim() : null }),
      ...(content !== undefined && { content: String(content) }),
      ...(imageUrl !== undefined && { imageUrl: imageUrl ? String(imageUrl).trim() : null }),
      ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
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

  return {
    success: true,
    data: updated,
  }
})
