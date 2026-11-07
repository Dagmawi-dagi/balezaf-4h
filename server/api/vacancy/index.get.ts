import { defineEventHandler } from 'h3'
import getVacancies from '../vacancies/index.get'

export default defineEventHandler(async (event) => {
  return await getVacancies(event)
})
