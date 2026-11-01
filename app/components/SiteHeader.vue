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
  { label: 'Products', to: '/#products' },
  { label: 'Events', to: '/events' },
  { label: 'Journal', to: '/blog' },
  { label: 'Careers', to: '/careers' },
]
</script>

<template>
  <header :class="['sticky top-0 z-50 border-b border-[#dfe9da] bg-white text-[#173b2b] transition-shadow duration-300', isScrolled ? 'shadow-[0_8px_24px_rgba(23,59,43,0.08)]' : '']">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
      <NuxtLink to="/" class="flex items-center gap-3" aria-label="Desta Spirits home">
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-[#173b2b] text-sm font-bold text-white">D</div>
        <div class="leading-none"><span class="block text-lg font-semibold tracking-[0.18em]">DESTA</span><span class="mt-1 block text-[9px] uppercase tracking-[0.25em] text-[#65975d]">Spirits &amp; Liqueurs</span></div>
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
