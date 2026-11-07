import { defineEventHandler } from 'h3'
import applyHandler from '../vacancies/[id]/apply.post'

export default defineEventHandler(async (event) => {
  return await applyHandler(event)
})
