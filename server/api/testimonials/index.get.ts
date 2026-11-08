import { defineEventHandler } from 'h3'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const DATA_FILE = path.resolve(process.cwd(), 'server/data/testimonials.json')

export default defineEventHandler(async () => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    const list = JSON.parse(raw)
    return {
      success: true,
      data: Array.isArray(list) ? list : [],
    }
  } catch (err: any) {
    // If file does not exist, return empty array with success
    console.warn('Error reading server/data/testimonials.json:', err.message)
    return {
      success: true,
      data: [],
    }
  }
})
