import type { H3Event } from 'h3'
import { getCookie, getHeader, createError } from 'h3'
import { verifyUserToken, type TokenPayload } from './jwt'

export function getUserFromEvent(event: H3Event): TokenPayload | null {
  // 1. Check Authorization header
  const authHeader = getHeader(event, 'authorization')
  let token: string | undefined

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim()
  }

  // 2. Fallback to HttpOnly cookie
  if (!token) {
    token = getCookie(event, 'balezaf_token')
  }

  if (!token) {
    return null
  }

  return verifyUserToken(token)
}

export function requireAuth(event: H3Event): TokenPayload {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please log in to access this resource.',
    })
  }
  return user
}

export function requireAdmin(event: H3Event): TokenPayload {
  const user = requireAuth(event)
  if (user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden. Admin privileges required.',
    })
  }
  return user
}
