import { computed, ref, watch } from 'vue'

export type Locale = 'en' | 'am'

const STORAGE_KEY = 'balezaf_preferred_language'

// Global reactive locale state
const currentLocale = ref<Locale>('en')
const isInitialized = ref(false)

export const translations = {
  en: {
    langName: 'English',
    langAlt: 'አማርኛ',
    topBar: {
      location: 'Addis Ababa, Ethiopia',
      call: 'Call Us',
    },
    nav: {
      home: 'Home',
      about: 'About Us',
      products: 'Products',
      blog: 'Blog',
      order: 'Order',
      careers: 'Careers',
      contact: 'Contact Us',
      admin: 'Admin',
      menu: 'Menu',
      language: 'Language',
    },
    hero: {
      badge: 'Made with patience · Bottled with purpose',
      titlePart1: 'Rich Ethiopian spirits, crafted with',
      titleItalic: 'patient pride.',
      desc: 'From Addis Ababa, Balezaf blends traditional botanical wisdom with modern fractional distillation — creating balanced gins, vodkas, and heritage liqueurs for memorable Ethiopian rituals.',
      orderBtn: 'Order for your venue →',
      exploreBtn: 'Explore products',
      specPlant: 'Purpose-built distillation facility in Addis Ababa',
      specTour: 'Campus Tour',
    },
    milestones: {
      title: 'A Decade of Distillation Excellence',
      spirits: 'Spirits & Liqueurs',
      spiritsDesc: 'Signature gins, vodkas, ouzo, zebib, and fruit liqueurs.',
      team: 'Team Members',
      teamDesc: 'Master distillers, botanists, bottlers, and distribution crew.',
      modernPlant: 'Modern Plant',
      modernPlantDesc: 'Upgraded automated distillation and high-precision bottling lines.',
      warehouses: 'Warehouses',
      warehousesDesc: 'Climate-controlled secure storage for batch purity.',
      campus: 'Production Plant',
      campusDesc: 'Purpose-built Addis Ababa facilities for thoughtful Ethiopian craft.',
    },
    productsSec: {
      eyebrow: 'Top flagships',
      title: 'Crafted for your',
      titleItalic: 'ritual.',
      subtitle: 'Three of our most celebrated Ethiopian spirits. Click any card for detailed notes.',
      viewAll: 'View all 10 products ↗',
      orderBottle: 'Order bottle →',
      fullNotes: 'Full notes',
      viewSpecs: 'View specs',
    },
    testimonials: {
      eyebrow: 'Partner & Customer Voices',
      title: 'Trusted on Ethiopia’s',
      titleItalic: 'finest tables.',
      desc: 'From five-star diplomatic hotel lounges in Addis Ababa to premier craft cocktail bars and regional wholesale distributors—hear how our spirits elevate hospitality rituals across Ethiopia.',
      badgePartner: 'Luxury Hospitality Partner',
      badgeBar: 'Craft Cocktail Bar',
      badgeDistributor: 'National Distribution Partner',
      statsVenues: 'Hospitality Venues',
      statsRating: 'Average Quality Rating',
      statsFulfillment: 'On-Time Fulfillment',
      statsTerroir: 'Ethiopian Terroir',
    },
    contact: {
      eyebrow: 'Let’s talk',
      title: 'Bring a little more',
      titleItalic: 'spirit to the table.',
      desc: 'For wholesale orders, retail distribution, partnerships, or bottle queries, our distillery team is here for you.',
      location: 'Addis Ababa, Ethiopia',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      emailPlaceholder: 'you@company.com',
      messageLabel: 'How can we help?',
      messagePlaceholder: 'Tell us about your order or partnership',
      submitBtn: 'Send inquiry ↗',
      successMsg: 'Thanks — your inquiry has been received. We’ll be in touch shortly.',
    },
    footer: {
      tagline: 'Distilling authentic Ethiopian spirits, signature gins, vodkas, and craft fruit liqueurs in Addis Ababa since 1996.',
      ourSpirits: 'Our Spirits',
      explore: 'Explore',
      distilleryMap: 'Distillery Location',
      mapDirections: 'Open in Google Maps ↗',
      rights: 'Balezaf Alcohol & Liquors Factory PLC. All rights reserved.',
      disclaimer: 'Please enjoy responsibly. Intended only for persons of legal drinking age (21+).',
      switchLang: 'Language Preference',
    },
    about: {
      eyebrow: 'Our Manufacturing Standard',
      title: 'Distilling Ethiopian heritage with',
      titleItalic: 'modern industrial precision.',
      peopleTitle: 'The People of Balezaf',
      peopleSubtitle: 'The master distillers & engineers behind every batch.',
      communityTitle: 'Community & Social Responsibility',
      communitySubtitle: 'Rooted in the soil. Invested in our people.',
    },
  },
  am: {
    langName: 'አማርኛ',
    langAlt: 'English',
    topBar: {
      location: 'አዲስ አበባ፣ ኢትዮጵያ',
      call: 'ይደውሉልን',
    },
    nav: {
      home: 'መነሻ',
      about: 'ስለ እኛ',
      products: 'ምርቶች',
      blog: 'ብሎግ',
      order: 'ትዕዛዝ',
      careers: 'የስራ እድሎች',
      contact: 'ያግኙን',
      admin: 'አስተዳዳሪ',
      menu: 'ማውጫ',
      language: 'ቋንቋ',
    },
    hero: {
      badge: 'በትዕግስት የተጣራ · በክብር የታሸገ',
      titlePart1: 'የኢትዮጵያ የጠሩ ምርጥ መጠጦች በከፍተኛ',
      titleItalic: 'ኩራትና ጥራት።',
      desc: 'ባለዛፍ አልኮልና መጠጥ ፋብሪካ በአዲስ አበባ የሀገራችንን ጥንታዊ የተፈጥሮ እጽዋት ጥበብ ከዘመናዊ የማጣራት ቴክኖሎጂ ጋር በማዋሃድ ንፁህ ጂን፣ ቮድካ፣ ዘቢብ እና ልዩ የፍራፍሬ አረቄዎችን ያቀርባል።',
      orderBtn: 'የጅምላ ትዕዛዝ ይዘዙ →',
      exploreBtn: 'ምርቶቹን ይመልከቱ',
      specPlant: 'በአዲስ አበባ የሚገኝ ዘመናዊ የማምረቻ ማዕከል',
      specTour: 'ፋብሪካውን ይጎብኙ',
    },
    milestones: {
      title: 'የአስር ዓመታት የጥራት ጉዞ',
      spirits: 'የተለያዩ መጠጦች',
      spiritsDesc: 'ልዩ ጂን፣ ቮድካ፣ ኡዞ፣ ዘቢብ እና የፍራፍሬ አረቄዎች።',
      team: 'የቡድን አባላት',
      teamDesc: 'ዋና ቀማሚዎች፣ ኬሚስቶች፣ አሸጊዎችና አከፋፋዮች።',
      modernPlant: 'ዘመናዊ ፋብሪካ',
      modernPlantDesc: 'ዘመናዊ አውቶማቲክ ማጣሪያ እና ከፍተኛ ጥራት ያለው ማሸጊያ መስመር።',
      warehouses: 'መጋዘኖች',
      warehousesDesc: 'የመጠጥ ንፅህናን የሚጠብቁ የሙቀት መቆጣጠሪያ ያላቸው መጋዘኖች።',
      campus: 'የማምረቻ ማዕከል',
      campusDesc: 'በአዲስ አበባ የተገነባ የላቀ የኢትዮጵያ መጠጥ ማምረቻ።',
    },
    productsSec: {
      eyebrow: 'ዋና ዋና ምርቶች',
      title: 'ለእርስዎ ልዩ ጊዜ',
      titleItalic: 'የተመረጡ።',
      subtitle: 'ከምርቶቻችን መካከል በብዛት የተወደዱ ሶስቱ ድንቅ መጠጦች። ዝርዝሩን ለማየት ምርቱን ይጫኑ።',
      viewAll: 'ሁሉንም 10 ምርቶች ይመልከቱ ↗',
      orderBottle: 'እዘዝ →',
      fullNotes: 'ሙሉ መረጃ',
      viewSpecs: 'መግለጫ',
    },
    testimonials: {
      eyebrow: 'የደንበኞችና የአጋሮች ምስክርነት',
      title: 'በኢትዮጵያ ታላላቅ',
      titleItalic: 'ማዕዶች የተመረጠ።',
      desc: 'በአዲስ አበባ ከሚገኙ ባለአምስት ኮከብ ሆቴሎች እስከ ታዋቂ ላውንጆችና አከፋፋዮች ድረስ—ምርቶቻችን የደንበኞችን እርካታ እንዴት እንዳሳደጉ ይመልከቱ።',
      badgePartner: 'የከፍተኛ ሆቴል አጋር',
      badgeBar: 'የኮክቴል ላውንጅ',
      badgeDistributor: 'ሀገር አቀፍ አከፋፋይ',
      statsVenues: 'የሆቴልና ላውንጅ ደንበኞች',
      statsRating: 'አማካይ የጥራት ደረጃ',
      statsFulfillment: 'ትክክለኛ አቅርቦት',
      statsTerroir: 'የኢትዮጵያ ጥሬ እቃ',
    },
    contact: {
      eyebrow: 'ያግኙን',
      title: 'ለማዕድዎ ተጨማሪ',
      titleItalic: 'ደስታ ያምጡ።',
      desc: 'ለጅምላ ትዕዛዞች፣ ለችርቻሮ ስርጭት፣ ለአጋርነት ወይም ለማንኛውም ጥያቄ የፋብሪካችን ቡድን ሁሌም ዝግጁ ነው።',
      location: 'አዲስ አበባ፣ ኢትዮጵያ',
      nameLabel: 'ስም',
      namePlaceholder: 'ሙሉ ስምዎን ያስገቡ',
      emailLabel: 'ኢሜይል',
      emailPlaceholder: 'you@company.com',
      messageLabel: 'እንዴት ልንረዳዎ እንችላለን?',
      messagePlaceholder: 'ስለ ትዕዛዝዎ ወይም አጋርነትዎ ይፃፉልን...',
      submitBtn: 'መልዕክት ይላኩ ↗',
      successMsg: 'እናመሰግናለን! መልዕክትዎ ደርሶናል፣ በቅርቡ ምላሽ እንሰጣለን።',
    },
    footer: {
      tagline: 'ከ1996 ጀምሮ በአዲስ አበባ ጥራት ያላቸው የኢትዮጵያ መጠጦችን፣ ጂን፣ ቮድካ እና የፍራፍሬ አረቄዎችን በማምረት ላይ ይገኛል።',
      ourSpirits: 'ምርቶቻችን',
      explore: 'ገጾች',
      distilleryMap: 'የፋብሪካው አድራሻ',
      mapDirections: 'በGoogle ካርታ ይመልከቱ ↗',
      rights: 'ባለዛፍ አልኮልና መጠጥ ፋብሪካ ኃ/የተ/የግ/ማ። መብቱ በህግ የተጠበቀ ነው።',
      disclaimer: 'እባክዎን በኃላፊነት ይጠጡ። ከ21 ዓመት በላይ ለሆኑ ብቻ የተፈቀደ።',
      switchLang: 'ቋንቋ ይምረጡ',
    },
    about: {
      eyebrow: 'የማምረቻ ጥራት ደረጃችን',
      title: 'የኢትዮጵያን ሀብት ከዘመናዊ',
      titleItalic: 'ኢንዱስትሪያል ቴክኖሎጂ ጋር።',
      peopleTitle: 'የባለዛፍ ባለሙያዎች',
      peopleSubtitle: 'ከእያንዳንዱ ጠብታ ጀርባ ያሉ ዋና ቀማሚዎችና መሃንዲሶች።',
      communityTitle: 'ማህበራዊ ኃላፊነትና የበጎ አድራጎት ስራዎች',
      communitySubtitle: 'በአፈር ላይ የተመሰረተ፤ በህዝባችን ላይ ኢንቨስት ያደረገ።',
    },
  },
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
