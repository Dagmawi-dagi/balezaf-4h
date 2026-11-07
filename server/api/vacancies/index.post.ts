import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)

  const {
    title,
    position_name,
    company,
    locations,
    deadline,
    salary,
    team,
    type,
    description,
    requirements,
    status,
  } = body || {}

  const resolvedTitle = title || position_name
  if (!resolvedTitle || !description) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Position name and description are required.',
    })
  }

  const locationsArray = Array.isArray(locations)
    ? locations
    : typeof locations === 'string'
      ? locations.split(',').map((l: string) => l.trim()).filter(Boolean)
      : ['Addis Ababa']

  const vacancy = await prisma.vacancy.create({
    data: {
      title: String(resolvedTitle).trim(),
      positionName: String(resolvedTitle).trim(),
      company: company ? String(company).trim() : 'BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
      locations: locationsArray,
      deadline: deadline ? new Date(deadline) : null,
      salary: salary ? String(salary).trim() : 'based in the company scale',
      team: team ? String(team).trim() : '',
      type: type ? String(type).trim() : 'Full-time',
      description: String(description).trim(),
      requirements: requirements ? String(requirements).trim() : null,
      status: status === 'CLOSED' ? 'CLOSED' : 'OPEN',
    },
  })

  return {
    success: true,
    data: vacancy,
  }
})
