<script setup lang="ts">
const mobileOpen = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 24
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const links = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Blog', to: '/blog' },
  { label: 'Careers', to: '/careers' },
]
</script>

<template>
  <header :class="['sticky top-0 z-50 border-b border-[#dfe9da] bg-white text-[#173b2b] transition-shadow duration-300', isScrolled ? 'shadow-[0_8px_24px_rgba(23,59,43,0.08)]' : '']">
    <div class="bg-[#173b2b] text-xs text-white">
      <div class="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-10">
        <div class="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
          <a href="tel:+251914300007" class="whitespace-nowrap transition hover:text-[#b8d7af]">+251 914 300 007</a>
          <a href="tel:+251914705089" class="hidden whitespace-nowrap transition hover:text-[#b8d7af] sm:inline">+251 914 705 089</a>
          <a href="mailto:destaalcohol@gmail.com" class="hidden truncate transition hover:text-[#b8d7af] sm:inline">destaalcohol@gmail.com</a>
        </div>
        <div class="flex items-center gap-4">
          <span class="hidden items-center gap-2 whitespace-nowrap text-[#b8d7af] md:inline-flex"><svg aria-hidden="true" class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.2"/></svg><span>Addis Ababa, Ethiopia</span></span>
          <div class="flex items-center gap-3 border-l border-white/20 pl-4" aria-label="Social media links">
            <a href="#" aria-label="TikTok" class="transition hover:text-[#b8d7af]">
              <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 fill-current"><path d="M15.2 3h3.1c.3 1.7 1.3 2.9 3 3.3v3.2a8.4 8.4 0 0 1-3-.8v6.2a6.1 6.1 0 1 1-6.1-6.1c.3 0 .7 0 1 .1v3.3a2.9 2.9 0 1 0 1.9 2.7V3Z" /></svg>
            </a>
            <a href="#" aria-label="Facebook" class="transition hover:text-[#b8d7af]">
              <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 fill-current"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H7.7v3h2.7v8h3.1Z" /></svg>
            </a>
            <a href="#" aria-label="YouTube" class="transition hover:text-[#b8d7af]">
              <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 fill-current"><path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.4V8.6l6 3.4-6 3.4Z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
      <NuxtLink to="/" class="flex min-w-0 shrink items-center gap-2 sm:gap-3" aria-label="Balezaf Alcohol Liquors Factory PLC home">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balezaf%20alcohol%20liquors%20factory%20plc%20LOGO-qsQOjEqqCnEubCgRx3GHDzu11GaPo2.png" alt="Balezaf Alcohol Liquors Factory PLC logo" class="h-10 w-10 shrink-0 rounded-full object-cover sm:h-12 sm:w-12" />
        <div class="min-w-0 max-w-[170px] leading-tight sm:max-w-[220px]"><span class="block truncate text-[11px] font-semibold uppercase tracking-[0.06em] sm:text-sm sm:tracking-[0.08em]">Balezaf Alcohol Liquors Factory PLC</span><span class="mt-1 block truncate text-[8px] uppercase tracking-[0.14em] text-[#65975d] sm:text-[9px] sm:tracking-[0.22em]">Alcohol &amp; Liquor Factory</span></div>
      </NuxtLink>
      <nav class="hidden items-center gap-7 text-sm font-medium lg:flex" aria-label="Main navigation">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="transition hover:text-[#65975d]">{{ link.label }}</NuxtLink>
        <NuxtLink to="/contact" class="rounded-full bg-[#173b2b] px-5 py-2.5 text-white transition hover:bg-[#35653c]">Contact us <span aria-hidden="true">↗</span></NuxtLink>
      </nav>
      <button class="rounded-full border border-[#b8d7af] px-3 py-2 text-sm lg:hidden" aria-label="Toggle menu" @click="mobileOpen = !mobileOpen">Menu</button>
    </div>
    <nav v-if="mobileOpen" class="mx-6 mb-5 rounded-2xl bg-[#173b2b] p-5 text-white lg:hidden" aria-label="Mobile navigation"><div class="flex flex-col gap-4"><NuxtLink v-for="link in links" :key="link.to" :to="link.to" @click="mobileOpen = false">{{ link.label }}</NuxtLink><NuxtLink to="/contact" @click="mobileOpen = false">Contact us</NuxtLink></div></nav>
  </header>
</template>
