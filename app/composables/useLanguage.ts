import { computed, ref } from 'vue'
import en from '~/locales/en.json'
import am from '~/locales/am.json'

export type Locale = 'en' | 'am'

const STORAGE_KEY = 'balezaf_preferred_language'

// Global reactive locale state
const currentLocale = ref<Locale>('en')
const isInitialized = ref(false)

export const translations = {
  en,
  am,
} as const

export function useLanguage() {
  const initLanguage = () => {
    if (!import.meta.client || isInitialized.value) return
    isInitialized.value = true

    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (saved === 'en' || saved === 'am') {
        currentLocale.value = saved
      } else if (navigator.language && navigator.language.toLowerCase().startsWith('am')) {
        currentLocale.value = 'am'
      }
    } catch {
      // Ignore localStorage errors
    }

    updateHtmlLang(currentLocale.value)
  }

  const updateHtmlLang = (locale: Locale) => {
    if (import.meta.client && document.documentElement) {
      document.documentElement.lang = locale
    }
  }

  const setLocale = (locale: Locale) => {
    currentLocale.value = locale
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, locale)
      } catch {
        // Ignore localStorage errors
      }
      updateHtmlLang(locale)
    }
  }

  const toggleLocale = () => {
    setLocale(currentLocale.value === 'en' ? 'am' : 'en')
  }

  const t = computed(() => translations[currentLocale.value])
  const isAmharic = computed(() => currentLocale.value === 'am')

  return {
    currentLocale,
    isAmharic,
    t,
    setLocale,
    toggleLocale,
    initLanguage,
  }
}
