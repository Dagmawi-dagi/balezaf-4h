import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default defineEventHandler(async (event) => {
  const user = requireAdmin(event)
  const body = await readBody(event)

  const { title, category, excerpt, content, imageUrl, isPublished } = body || {}

  if (!title || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and content are required.',
    })
  }

  // Generate unique slug
  let slug = slugify(title)
  const existing = await prisma.blogPost.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const post = await prisma.blogPost.create({
    data: {
      title: String(title).trim(),
      slug,
      category: category ? String(category).trim() : 'MAKING BALEZAF',
      excerpt: excerpt ? String(excerpt).trim() : null,
      content: String(content),
      imageUrl: imageUrl ? String(imageUrl).trim() : null,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      authorId: user.userId,
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
    data: post,
  }
})
