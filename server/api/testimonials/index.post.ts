import { defineEventHandler, readBody, createError } from 'h3'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { getUserFromEvent } from '../../utils/auth'

const DATA_FILE = path.resolve(process.cwd(), 'server/data/testimonials.json')

async function readTestimonials(): Promise<any[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeTestimonials(items: any[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  // Only authenticated admins can modify testimonials
  const user = getUserFromEvent(event)
  if (user && user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden. Admin privileges required.',
    })
  }

  const body = await readBody(event)
  const { action, item, id, updates, items } = body || {}

  let currentList = await readTestimonials()

  if (action === 'create' && item) {
    const newItem = {
      ...item,
      id: item.id || `${item.type === 'customer' ? 'cust' : 'emp'}-${Date.now()}`,
      createdAt: item.createdAt || new Date().toISOString().split('T')[0],
    }
    currentList.unshift(newItem)
    await writeTestimonials(currentList)
    return { success: true, item: newItem, data: currentList }
  }

  if (action === 'update' && id && updates) {
    const idx = currentList.findIndex((t) => t.id === id)
    if (idx !== -1) {
      currentList[idx] = { ...currentList[idx], ...updates }
      await writeTestimonials(currentList)
      return { success: true, item: currentList[idx], data: currentList }
    }
    throw createError({ statusCode: 404, statusMessage: 'Testimonial not found.' })
  }

  if (action === 'delete' && id) {
    currentList = currentList.filter((t) => t.id !== id)
    await writeTestimonials(currentList)
    return { success: true, data: currentList }
  }

  if (action === 'sync' && Array.isArray(items)) {
    currentList = items
    await writeTestimonials(currentList)
    return { success: true, data: currentList }
  }

  throw createError({ statusCode: 400, statusMessage: 'Invalid action or missing payload.' })
})
