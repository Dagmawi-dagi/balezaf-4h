<script setup lang="ts">
const products = [
  { name: 'Blue Nile Gin', type: 'London dry gin', note: 'Juniper-led, bright citrus finish' },
  { name: 'Desta Whisky', type: 'Blended whisky', note: 'Warm oak, vanilla and spice' },
  { name: 'Highland Vodka', type: 'Premium vodka', note: 'Clean, smooth and versatile' },
  { name: 'Abay Aperitif', type: 'Herbal aperitif', note: 'Bitter orange and garden herbs' },
]
useSeoMeta({ title: 'Products | Desta Spirits & Liqueurs', description: 'Explore the Desta portfolio of spirits and liqueurs crafted in Ethiopia.' })
</script>

<template>
  <div class="min-h-screen bg-[#fffdf9] text-[#173b2b]"><SiteHeader /><main><section class="bg-[#edf5e9] px-6 py-20 lg:px-10 lg:py-28"><div class="mx-auto max-w-7xl"><p class="text-xs font-semibold uppercase tracking-[0.25em] text-[#65975d]">Our portfolio</p><h1 class="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] lg:text-7xl">Spirits with a sense of place.</h1><p class="mt-6 max-w-2xl text-lg leading-8 text-[#54715a]">From crisp gin to rich whisky, every bottle is made for generous pours and memorable occasions.</p></div></section><section class="px-6 py-16 lg:px-10 lg:py-24"><div class="mx-auto grid max-w-7xl gap-5 md:grid-cols-2"> <article v-for="(product, index) in products" :key="product.name" class="rounded-[2rem] border border-[#dce8d7] bg-white p-8 shadow-[0_12px_35px_rgba(23,59,43,0.06)]"><div class="flex items-start justify-between"><span class="text-sm text-[#8eaa86]">0{{ index + 1 }}</span><span class="rounded-full bg-[#edf5e9] px-3 py-1 text-xs text-[#54715a]">{{ product.type }}</span></div><div class="mt-14 h-2 w-16 rounded-full bg-[#a7c99d]"></div><h2 class="mt-5 text-3xl font-semibold">{{ product.name }}</h2><p class="mt-3 text-[#6c8270]">{{ product.note }}</p><NuxtLink to="/contact" class="mt-8 inline-flex text-sm font-semibold text-[#35653c] hover:text-[#173b2b]">Request product information <span class="ml-2" aria-hidden="true">↗</span></NuxtLink></article></div></section></main><SiteFooter /></div>
</template>
