import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    server: { host: '0.0.0.0', allowedHosts: true },
  },
  devServer: { host: '0.0.0.0' },
  app: { head: { htmlAttrs: { lang: 'en' } } },
})
