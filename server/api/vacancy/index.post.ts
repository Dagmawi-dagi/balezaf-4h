import { defineEventHandler } from 'h3'
import postVacancy from '../vacancies/index.post'

export default defineEventHandler(async (event) => {
  return await postVacancy(event)
})
