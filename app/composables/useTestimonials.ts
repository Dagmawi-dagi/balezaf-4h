import { computed, ref } from 'vue'

export type TestimonialType = 'customer' | 'employee'

export interface CustomerTestimonial {
  id: string
  type: 'customer'
  author: string
  title: string
  titleAm?: string
  establishment: string
  establishmentAm?: string
  quote: string
  quoteAm?: string
  rating: number
  badge: string
  initials?: string
  avatar?: string
  featured?: boolean
  createdAt?: string
}

export interface EmployeeTestimonial {
  id: string
  type: 'employee'
  name: string
  role: string
  tenure: string
  image: string
  specialty: string
  quote: string
  quoteAm?: string
  highlights: string[]
  createdAt?: string
}

export type TestimonialItem = CustomerTestimonial | EmployeeTestimonial

const STORAGE_KEY = 'balezaf_testimonials_store_v1'

const defaultTestimonials: TestimonialItem[] = [
  // Customer Testimonials (featured on home page)
  {
    id: 'cust-1',
    type: 'customer',
    author: 'Yared Mengistu',
    title: 'Head Beverage Director',
    titleAm: 'የመጠጥና መስተንግዶ ዳይሬክተር',
    establishment: 'The Skylight Luxury Hotel, Addis Ababa',
    establishmentAm: 'ስካይላይት የቅንጦት ሆቴል፣ አዲስ አበባ',
    quote: 'Desta Gin has become the permanent crown jewel on our signature cocktail menu. The wild highland kosoret and citrus aroma profile astonishes international diplomats and guests who never realized Ethiopia was producing botanical spirits of this world-class caliber.',
    quoteAm: 'ደስታ ጂን በኮክቴል ዝርዝራችን ላይ ቋሚ ተመራጭ ሆኗል። የሀገር በቀሉ የኮሰረት እና የሎሚ መዓዛው አለምአቀፍ ዲፕሎማቶችንና እንግዶቻችንን በእጅጉ ያስደንቃል።',
    rating: 5,
    badge: 'Luxury Hospitality Partner',
    initials: 'YM',
    avatar: '',
    featured: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'cust-2',
    type: 'customer',
    author: 'Samrawit Fekadu',
    title: 'Lead Mixologist & Bar Manager',
    titleAm: 'ዋና የኮክቴል ቀማሚና ባር ማኔጀር',
    establishment: 'Bole Sky Lounge & Cocktail Bar',
    establishmentAm: 'ቦሌ ስካይ ላውንጅና ባር',
    quote: 'Their Zebib is without question the cleanest anise spirit I have ever poured. When crafting signature aperitifs, the silky mouthfeel and clean clouding louche effect are flawless. It bridges traditional Ethiopian banquets with modern craft mixology seamlessly.',
    quoteAm: 'ዘቢብ ካየኋቸው የአኒስ መጠጦች ሁሉ እጅግ በጣም የጠራና ንፁህ ነው። ለባህላዊ ድግሶችም ሆነ ለዘመናዊ የኮክቴል ዝግጅት ወደር የማይገኝለት ምርጥ ምርት ነው።',
    rating: 5,
    badge: 'Craft Cocktail Bar',
    initials: 'SF',
    avatar: '',
    featured: true,
    createdAt: '2026-02-01',
  },
  {
    id: 'cust-3',
    type: 'customer',
    author: 'Tewodros Haile',
    title: 'General Manager of Procurement',
    titleAm: 'የግዥና አቅርቦት ስራ አስኪያጅ',
    establishment: 'Rift Valley Beverage Distributors',
    establishmentAm: 'ሪፍት ቫሊ የመጠጥ አከፋፋዮች',
    quote: 'From supply-chain reliability to zero bottle variance across pallet shipments, Balezaf is our most dependable domestic partner. Their packaging aesthetics and industrial quality control rival top European spirit imports.',
    quoteAm: 'ከአቅርቦት አስተማማኝነት ጀምሮ እስከ ማሸጊያ ጥራት ድረስ ባለዛፍ ለእኛ እጅግ ታማኝ አጋራችን ነው። የአለም አቀፍ ደረጃን ያሟላ ድንቅ የሀገር ውስጥ ስራ ነው።',
    rating: 5,
    badge: 'National Distribution Partner',
    initials: 'TH',
    avatar: '',
    featured: true,
    createdAt: '2026-02-14',
  },
  // Employee Testimonials (featured on about us page)
  {
    id: 'emp-1',
    type: 'employee',
    name: 'Dawit Tadesse',
    role: 'Master Distiller & Head of Production',
    tenure: '9 Years at Balezaf',
    image: '/images/staff-distiller.jpg',
    specialty: 'Fractional Distillation & Botanical Infusion',
    quote: 'Distillation is both rigorous chemistry and sacred sensory intuition. When you stand next to the copper pot still at 6:00 AM, smelling the bright citrus and wild kosoret as the spirit vapors rise, you feel the soul of Ethiopia in every drop.',
    highlights: ['Supervised 2,400+ distillation runs', 'Pioneered signature Desta recipes', 'Trained 18 young apprentices'],
    createdAt: '2026-01-10',
  },
  {
    id: 'emp-2',
    type: 'employee',
    name: 'Dr. Bethlehem Assefa',
    role: 'Chief Quality Chemist & Laboratory Director',
    tenure: '6 Years at Balezaf',
    image: '/images/staff-chemist.jpg',
    specialty: 'Gas Chromatography & Chemical Purity',
    quote: 'Our laboratory never compromises. We hold every single batch to tighter tolerances than international benchmarks—testing for molecular clarity, volatile congeners, and absolute proof accuracy before a single bottle is cleared.',
    highlights: ['M.Sc. Analytical Chemistry (AAU)', 'ECAE Quality Compliance Lead', '100% batch release verification'],
    createdAt: '2026-01-20',
  },
  {
    id: 'emp-3',
    type: 'employee',
    name: 'Henok Alemu',
    role: 'Senior Packaging & Operations Supervisor',
    tenure: '7 Years at Balezaf',
    image: '/images/staff-packaging.jpg',
    specialty: 'Automated Line Engineering & Logistics',
    quote: 'I joined Balezaf as a junior maintenance technician in 2017 and grew into supervising the automated bottling hall. The culture here is like family: we take immense pride seeing our bottles celebrated at gatherings across Ethiopia.',
    highlights: ['Promoted from vocational trainee', 'Maintains 99.4% line efficiency', 'Zero-breakage handling lead'],
    createdAt: '2026-02-05',
  },
]

// Global reactive state
const testimonials = ref<TestimonialItem[]>(defaultTestimonials)
const isInitialized = ref(false)

function loadFromStorage() {
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        testimonials.value = parsed
      }
    }
  } catch (err) {
    console.warn('Failed to load testimonials from localStorage:', err)
  }
}

function saveToStorage() {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials.value))
  } catch (err) {
    console.warn('Failed to save testimonials to localStorage:', err)
  }
}

export function useTestimonials() {
  const init = () => {
    if (isInitialized.value || !import.meta.client) return
    isInitialized.value = true
    loadFromStorage()
  }

  // Trigger init if in browser
  if (import.meta.client && !isInitialized.value) {
    init()
  }

  const allTestimonials = computed(() => testimonials.value)

  const customerTestimonials = computed<CustomerTestimonial[]>(() =>
    testimonials.value.filter((t): t is CustomerTestimonial => t.type === 'customer')
  )

  const employeeTestimonials = computed<EmployeeTestimonial[]>(() =>
    testimonials.value.filter((t): t is EmployeeTestimonial => t.type === 'employee')
  )

  const addTestimonial = (item: Omit<TestimonialItem, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => {
    const newItem: TestimonialItem = {
      ...item,
      id: item.id || `${item.type === 'customer' ? 'cust' : 'emp'}-${Date.now()}`,
      createdAt: item.createdAt || new Date().toISOString().split('T')[0],
    } as TestimonialItem
    testimonials.value.unshift(newItem)
    saveToStorage()
    return newItem
  }

  const updateTestimonial = (id: string, updates: Partial<TestimonialItem>) => {
    const idx = testimonials.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      testimonials.value[idx] = {
        ...testimonials.value[idx],
        ...updates,
      } as TestimonialItem
      saveToStorage()
      return true
    }
    return false
  }

  const deleteTestimonial = (id: string) => {
    const prevLen = testimonials.value.length
    testimonials.value = testimonials.value.filter((t) => t.id !== id)
    if (testimonials.value.length !== prevLen) {
      saveToStorage()
      return true
    }
    return false
  }

  const resetToDefaults = () => {
    testimonials.value = [...defaultTestimonials]
    saveToStorage()
  }

  const exportJson = (): string => {
    return JSON.stringify(testimonials.value, null, 2)
  }

  const downloadJsonFile = () => {
    if (!import.meta.client) return
    const jsonStr = exportJson()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'balezaf-testimonials.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJsonString = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr)
      if (Array.isArray(parsed) && parsed.length > 0) {
        testimonials.value = parsed
        saveToStorage()
        return true
      }
    } catch (err) {
      console.error('Failed to import testimonials JSON:', err)
    }
    return false
  }

  return {
    allTestimonials,
    customerTestimonials,
    employeeTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    resetToDefaults,
    exportJson,
    downloadJsonFile,
    importJsonString,
    init,
  }
}
