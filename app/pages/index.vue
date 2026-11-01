<script setup lang="ts">
const products = [
  { name: 'Desta Dry Gin', category: 'Signature Gin', note: 'Crisp, botanical and clean', color: 'from-[#dcebd7] to-[#7caa72]', initials: 'DG' },
  { name: 'Desta Premium Vodka', category: 'Premium Spirits', note: 'Smooth with a refined finish', color: 'from-[#edf4ea] to-[#b7d3ad]', initials: 'PV' },
  { name: 'Golden Honey Liqueur', category: 'Craft Liqueur', note: 'Warm, rich and naturally sweet', color: 'from-[#ead7a5] to-[#bf8b39]', initials: 'GH' },
]

const inquirySent = ref(false)
const mobileOpen = ref(false)
const inquiry = reactive({ name: '', email: '', message: '' })

function submitInquiry() {
  inquirySent.value = true
  inquiry.name = ''
  inquiry.email = ''
  inquiry.message = ''
}
</script>

<template>
  <div class="min-h-screen bg-[#fffdf9] text-[#173b2b]">
    <header class="absolute inset-x-0 top-0 z-20 text-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <a href="#top" class="flex items-center gap-3" aria-label="Desta Spirits home">
          <div class="flex h-11 w-11 items-center justify-center rounded-full border border-[#b8d7af]/60 bg-[#143b29] text-sm font-bold tracking-tight">D</div>
          <div class="leading-none"><span class="block text-lg font-semibold tracking-[0.18em]">DESTA</span><span class="mt-1 block text-[9px] uppercase tracking-[0.25em] text-[#d1e6ca]">Spirits &amp; Liqueurs</span></div>
        </a>
        <nav class="hidden items-center gap-8 text-sm font-medium lg:flex" aria-label="Main navigation">
          <a class="text-[#b8d7af]" href="#top">Home</a><a class="transition hover:text-[#b8d7af]" href="#story">Our story</a><a class="transition hover:text-[#b8d7af]" href="#products">Products</a><a class="transition hover:text-[#b8d7af]" href="#contact">Contact</a>
          <a href="#products" class="rounded-full border border-white/30 px-5 py-2.5 transition hover:bg-white hover:text-[#173b2b]">Browse collection <span aria-hidden="true">↗</span></a>
        </nav>
        <button class="rounded-full border border-white/30 px-3 py-2 lg:hidden" aria-label="Toggle menu" @click="mobileOpen = !mobileOpen">Menu</button>
      </div>
      <nav v-if="mobileOpen" class="mx-6 rounded-2xl bg-[#143b29] p-5 lg:hidden" aria-label="Mobile navigation"><div class="flex flex-col gap-4"><a href="#story" @click="mobileOpen = false">Our story</a><a href="#products" @click="mobileOpen = false">Products</a><a href="#contact" @click="mobileOpen = false">Contact</a></div></nav>
    </header>

    <main id="top">
      <section class="relative overflow-hidden bg-[#123927] text-white">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(129,171,113,.38),transparent_28%),linear-gradient(115deg,#123927_0%,#1d5539_56%,#467b55_100%)]"></div>
        <div class="relative mx-auto grid min-h-[660px] max-w-7xl items-end gap-12 px-6 pb-20 pt-36 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-24">
          <div class="max-w-2xl"><p class="mb-7 text-xs font-semibold uppercase tracking-[0.35em] text-[#c9e6c1]">Made with patience · Bottled with purpose</p><h1 class="max-w-xl font-serif text-5xl leading-[.98] tracking-[-.04em] sm:text-7xl">The spirit of <em class="font-normal text-[#b8d7af]">good</em> making.</h1><p class="mt-7 max-w-lg text-base leading-7 text-[#d8e7d4]">Premium Ethiopian spirits and liqueurs, distilled with local character and a modern point of view.</p><div class="mt-9 flex flex-wrap gap-3"><a href="#products" class="rounded-full bg-[#c6dfbc] px-6 py-3 text-sm font-semibold text-[#173b2b] transition hover:bg-white">Explore products <span aria-hidden="true">↗</span></a><a href="#story" class="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold transition hover:bg-white/10">Discover Desta</a></div></div>
          <div class="relative mx-auto flex h-[350px] w-full max-w-[450px] items-end justify-center lg:h-[430px]"><div class="absolute bottom-0 h-52 w-72 rounded-full bg-[#9fc495]/20 blur-3xl"></div><div class="relative h-[300px] w-32 rounded-[26px_26px_18px_18px] border-2 border-white/25 bg-gradient-to-br from-[#d9ead2] via-[#779d6d] to-[#315c42] shadow-2xl rotate-[-7deg] lg:h-[360px] lg:w-40"><div class="absolute left-1/2 top-[-45px] h-16 w-14 -translate-x-1/2 rounded-t-lg rounded-b-sm bg-[#d4dec2] shadow-lg"></div><div class="absolute inset-x-3 top-1/3 rounded-sm bg-[#f6f0da] px-2 py-7 text-center text-[#245038] shadow-sm"><span class="block text-[10px] tracking-[.3em]">DESTA</span><span class="mt-2 block font-serif text-2xl">Gin</span><span class="mt-3 block text-[7px] uppercase tracking-widest">Botanical spirit</span></div></div><div class="absolute bottom-2 right-[10%] h-52 w-24 rounded-[20px_20px_14px_14px] border border-white/20 bg-gradient-to-br from-[#f1e3bc] via-[#c08b3e] to-[#744c21] shadow-xl rotate-[8deg] lg:h-64 lg:w-28"><div class="absolute left-1/2 top-[-35px] h-12 w-10 -translate-x-1/2] rounded-t-md bg-[#e1d4ae]"></div><div class="absolute inset-x-2 top-[37%] rounded-sm bg-[#f8efd2] px-1 py-4 text-center text-[#5a3d1b]"><span class="block text-[7px] tracking-[.25em]">DESTA</span><span class="mt-1 block font-serif text-lg">Honey</span></div></div></div>
        </div>
      </section>

      <section class="border-b border-[#dfe9da] bg-[#f3f7ef] px-6 py-6 lg:px-10"><div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 text-sm text-[#496a51]"><span class="font-semibold text-[#173b2b]">A new generation of Ethiopian spirits</span><div class="flex gap-8"><span>Handcrafted</span><span>Small batch</span><span>Responsible sourcing</span></div></div></section>

      <section id="story" class="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-32"><div><p class="eyebrow">Our point of view</p><h2 class="mt-5 max-w-md font-serif text-4xl leading-tight text-[#173b2b] sm:text-5xl">We make spirits worth <em class="text-[#65975d]">sharing.</em></h2></div><div class="max-w-2xl"><p class="text-xl leading-9 text-[#355944]">From the first botanical to the final pour, every Desta bottle is shaped by a belief in thoughtful craft. We pair Ethiopian ingredients and generous hospitality with precise, contemporary distilling.</p><div class="mt-10 grid grid-cols-3 gap-5 border-t border-[#dfe9da] pt-7"><div><strong class="font-serif text-4xl text-[#173b2b]">12</strong><span class="mt-1 block text-xs uppercase tracking-wider text-[#66816b]">Products</span></div><div><strong class="font-serif text-4xl text-[#173b2b]">80+</strong><span class="mt-1 block text-xs uppercase tracking-wider text-[#66816b]">Team members</span></div><div><strong class="font-serif text-4xl text-[#173b2b]">2012</strong><span class="mt-1 block text-xs uppercase tracking-wider text-[#66816b]">Established</span></div></div></div></section>

      <section id="products" class="bg-[#173b2b] px-6 py-24 text-white lg:px-10 lg:py-28"><div class="mx-auto max-w-7xl"><div class="flex flex-wrap items-end justify-between gap-6"><div><p class="eyebrow text-[#b8d7af]">The collection</p><h2 class="mt-4 font-serif text-4xl sm:text-5xl">Made for your <em class="font-normal text-[#b8d7af]">ritual.</em></h2></div><a href="#contact" class="rounded-full border border-white/30 px-5 py-3 text-sm transition hover:bg-white hover:text-[#173b2b]">Request a catalogue ↗</a></div><div class="mt-12 grid gap-5 md:grid-cols-3"> <article v-for="product in products" :key="product.name" class="group overflow-hidden rounded-2xl bg-[#f5f7ee] text-[#173b2b]"><div :class="['relative flex h-72 items-end justify-center overflow-hidden bg-gradient-to-br', product.color]"><div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,.75),transparent_45%)]"></div><div class="relative mb-[-12px] h-52 w-20 rounded-[18px_18px_10px_10px] border border-white/45 bg-gradient-to-r from-white/65 via-white/10 to-black/15 shadow-2xl transition duration-500 group-hover:-translate-y-3"><div class="absolute left-1/2 top-[-28px] h-9 w-8 -translate-x-1/2 rounded-t-md bg-[#e8e3c8]"></div><div class="absolute inset-x-1 top-[38%] rounded-sm bg-[#fffaf0] px-1 py-3 text-center"><span class="block text-[7px] font-semibold tracking-[.2em]">DESTA</span><span class="block font-serif text-base">{{ product.initials }}</span></div></div></div><div class="p-6"><p class="text-xs uppercase tracking-[.18em] text-[#779277]">{{ product.category }}</p><h3 class="mt-2 font-serif text-2xl">{{ product.name }}</h3><p class="mt-2 text-sm text-[#66816b]">{{ product.note }}</p><button class="mt-6 text-sm font-semibold text-[#4f8a56]">View product <span aria-hidden="true">→</span></button></div></article></div></div></section>

      <section id="contact" class="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:py-32"><div><p class="eyebrow">Let&apos;s talk</p><h2 class="mt-5 max-w-md font-serif text-4xl leading-tight sm:text-5xl">Bring a little more <em class="text-[#65975d]">spirit</em> to the table.</h2><p class="mt-6 max-w-md leading-7 text-[#66816b]">For wholesale orders, partnerships, or product questions, our team would love to hear from you.</p><div class="mt-10 space-y-4 text-sm text-[#355944]"><p><span class="mr-3 text-[#65975d]">✦</span> Addis Ababa, Ethiopia</p><p><span class="mr-3 text-[#65975d]">✦</span> +251 914 300 007</p><p><span class="mr-3 text-[#65975d]">✦</span> destaalcohol@gmail.com</p></div></div><form class="rounded-3xl bg-[#f1f6ed] p-7 sm:p-10" @submit.prevent="submitInquiry"><div v-if="inquirySent" class="mb-6 rounded-xl border border-[#b8d7af] bg-white p-4 text-sm text-[#35653c]">Thanks — your inquiry has been received. We&apos;ll be in touch soon.</div><div class="grid gap-5 sm:grid-cols-2"><label class="text-sm font-medium">Name<input v-model="inquiry.name" required class="field" placeholder="Your name" /></label><label class="text-sm font-medium">Email<input v-model="inquiry.email" required type="email" class="field" placeholder="you@company.com" /></label></div><label class="mt-5 block text-sm font-medium">How can we help?<textarea v-model="inquiry.message" required class="field min-h-32 resize-y" placeholder="Tell us about your order or partnership"></textarea></label><button class="mt-6 rounded-full bg-[#173b2b] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#35653c]">Send inquiry <span aria-hidden="true">↗</span></button></form></section>
    </main>
    <footer class="bg-[#102e21] px-6 py-10 text-[#c8ddc4] lg:px-10"><div class="mx-auto flex max-w-7xl flex-col justify-between gap-7 border-b border-white/15 pb-8 sm:flex-row"><div><span class="text-lg font-semibold tracking-[0.18em] text-white">DESTA</span><p class="mt-2 max-w-xs text-sm text-[#a8c0a5]">Crafted in Ethiopia. Shared everywhere.</p></div><div class="flex gap-6 text-sm"><a href="#story" class="hover:text-white">Our story</a><a href="#products" class="hover:text-white">Products</a><a href="#contact" class="hover:text-white">Contact</a></div></div><div class="mx-auto max-w-7xl pt-6 text-xs text-[#8daa8c]">© 2026 Desta Alcohol &amp; Liquor Factory PLC · Please enjoy responsibly.</div></footer>
  </div>
</template>
