import { computed, ref } from 'vue'
import defaultProductsData from '~/data/products.json'

import ananasImg from '~/assets/ananas.png'
import appleImg from '~/assets/apple.png'
import aprativeImg from '~/assets/aprative.png'
import coffeeImg from '~/assets/coffee.png'
import cognacImg from '~/assets/cognac.png'
import ginImg from '~/assets/gin.png'
import limeImg from '~/assets/lime.png'
import uozoImg from '~/assets/uozo.png'
import vodkaImg from '~/assets/vodka.png'
import zebibImg from '~/assets/zebib.png'

export interface ProductItem {
  id: string
  name: string
  category: string
  volume: string
  abv: string
  tagline: string
  note: string
  imageKey: string
  color: string
  glowColor: string
  aroma: string
  palate: string
  finish: string
  serving: string
  isTopFlagship: boolean
  badge?: string
}

// Map imageKey to imported asset URL
const imageMap: Record<string, string> = {
  gin: ginImg,
  vodka: vodkaImg,
  uozo: uozoImg,
  zebib: zebibImg,
  cognac: cognacImg,
  coffee: coffeeImg,
  ananas: ananasImg,
  apple: appleImg,
  lime: limeImg,
  aprative: aprativeImg,
}

export function resolveBottleImage(keyOrUrl: string): string {
  if (!keyOrUrl) return ginImg
  if (keyOrUrl in imageMap) return imageMap[keyOrUrl]
  if (keyOrUrl.startsWith('http') || keyOrUrl.startsWith('data:') || keyOrUrl.startsWith('/')) {
    return keyOrUrl
  }
  return ginImg
}

const STORAGE_KEY = 'balezaf_products_v1'

// Shared reactive state
const productsState = ref<ProductItem[]>([])
const isInitialized = ref(false)

function initProducts() {
  if (isInitialized.value) return
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          productsState.value = parsed
          isInitialized.value = true
          return
        }
      }
    } catch (e) {
      console.warn('Could not read products from localStorage:', e)
    }
  }
  // Default to products.json
  productsState.value = JSON.parse(JSON.stringify(defaultProductsData))
  isInitialized.value = true
}

export function useProducts() {
  initProducts()

  const allProducts = computed(() => {
    return productsState.value.map((p) => ({
      ...p,
      image: resolveBottleImage(p.imageKey),
      badge: getBadgeClass(p.id),
    }))
  })

  // Top flagship products for home page (strictly 3)
  const topProducts = computed(() => {
    const flagships = allProducts.value.filter((p) => p.isTopFlagship)
    if (flagships.length >= 3) return flagships.slice(0, 3)
    // Fallback: take first 3 if fewer than 3 flagged
    return allProducts.value.slice(0, 3)
  })

  function saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(productsState.value))
      } catch (e) {
        console.warn('Could not save products to localStorage:', e)
      }
    }
  }

  function updateProduct(id: string, updated: Partial<ProductItem>) {
    const idx = productsState.value.findIndex((p) => p.id === id)
    if (idx !== -1) {
      productsState.value[idx] = { ...productsState.value[idx], ...updated }
      saveToStorage()
      return true
    }
    return false
  }

  function addProduct(item: ProductItem) {
    productsState.value.push(item)
    saveToStorage()
  }

  function deleteProduct(id: string) {
    productsState.value = productsState.value.filter((p) => p.id !== id)
    saveToStorage()
  }

  function resetToDefaults() {
    productsState.value = JSON.parse(JSON.stringify(defaultProductsData))
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  function exportJson(): string {
    return JSON.stringify(productsState.value, null, 2)
  }

  function downloadJsonFile() {
    if (typeof window === 'undefined') return
    const jsonStr = exportJson()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJsonString(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr)
      if (Array.isArray(parsed) && parsed.length > 0) {
        productsState.value = parsed
        saveToStorage()
        return true
      }
    } catch (e) {
      console.error('Invalid JSON file format', e)
    }
    return false
  }

  return {
    products: allProducts,
    rawProducts: productsState,
    topProducts,
    updateProduct,
    addProduct,
    deleteProduct,
    resetToDefaults,
    exportJson,
    downloadJsonFile,
    importJsonString,
    availableImageKeys: Object.keys(imageMap),
  }
}

function getBadgeClass(id: string): string {
  switch (id) {
    case 'gin':
      return 'bg-[#e7f4e9] text-[#1f5a2b]'
    case 'vodka':
      return 'bg-[#e5f4f8] text-[#13495b]'
    case 'uozo':
      return 'bg-[#e7f1f8] text-[#154661]'
    case 'zebib':
      return 'bg-[#faf0df] text-[#6d4111]'
    case 'cognac':
      return 'bg-[#faece6] text-[#71280d]'
    case 'coffee':
      return 'bg-[#f6eee9] text-[#4d2512]'
    case 'ananas':
      return 'bg-[#faf5de] text-[#694806]'
    case 'apple':
      return 'bg-[#fbecea] text-[#6b1e16]'
    case 'lime':
      return 'bg-[#f3f9e7] text-[#36510d]'
    case 'aprative':
      return 'bg-[#faebeb] text-[#6a1515]'
    default:
      return 'bg-[#edf5e9] text-[#2c6338]'
  }
}
