import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vacancy ID is required.',
    })
  }

  const existing = await prisma.vacancy.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job vacancy not found.',
    })
  }

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

  const locationsArray = locations !== undefined
    ? (Array.isArray(locations)
        ? locations
        : typeof locations === 'string'
          ? locations.split(',').map((l: string) => l.trim()).filter(Boolean)
          : undefined)
    : undefined

  const updated = await prisma.vacancy.update({
    where: { id },
    data: {
      ...(resolvedTitle !== undefined && {
        title: String(resolvedTitle).trim(),
        positionName: String(resolvedTitle).trim(),
      }),
      ...(company !== undefined && { company: String(company).trim() }),
      ...(locationsArray !== undefined && { locations: locationsArray }),
      ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      ...(salary !== undefined && { salary: String(salary).trim() }),
      ...(team !== undefined && { team: String(team).trim() }),
      ...(type !== undefined && { type: String(type).trim() }),
      ...(description !== undefined && { description: String(description).trim() }),
      ...(requirements !== undefined && {
        requirements: requirements ? String(requirements).trim() : null,
      }),
      ...(status !== undefined && { status: status === 'CLOSED' ? 'CLOSED' : 'OPEN' }),
    },
  })

  return {
    success: true,
    data: updated,
  }
})
