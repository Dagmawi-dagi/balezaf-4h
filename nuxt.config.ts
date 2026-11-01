import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Balezaf Alcohol & Liquors Factory PLC',
      meta: [
        {
          name: 'description',
          content: 'Authentic Ethiopian spirits, signature gins, vodkas, and craft liqueurs distilled in Addis Ababa.',
        },
      ],
    },
  },
})
