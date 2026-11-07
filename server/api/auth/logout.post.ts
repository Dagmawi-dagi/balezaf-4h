import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'balezaf_token', {
    path: '/',
  })

  return {
    success: true,
    message: 'Successfully logged out.',
  }
})
