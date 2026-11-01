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
