import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'balezaf-fallback-secret-2026'

export interface TokenPayload {
  userId: string
  email: string
  role: string
  fullName: string
}

export function signUserToken(payload: TokenPayload, expiresIn: string | number = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions)
}

export function verifyUserToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}
