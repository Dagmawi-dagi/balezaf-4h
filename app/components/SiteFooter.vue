<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useProducts } from '~/composables/useProducts'

const { t } = useLanguage()
const { products } = useProducts()

const exploreLinks = computed(() => [
  { label: t.value.nav.home, to: '/' },
  { label: t.value.nav.about, to: '/about' },
  { label: t.value.nav.products, to: '/products' },
  { label: t.value.nav.order, to: '/order' },
  { label: t.value.nav.blog, to: '/blog' },
  { label: t.value.nav.careers, to: '/careers' },
  { label: t.value.nav.contact, to: '/contact' },
  { label: t.value.nav.admin, to: '/admin' },
])

const socialLinks = [
  {
    name: 'TikTok',
    href: '#',
    svg: 'M15.2 3h3.1c.3 1.7 1.3 2.9 3 3.3v3.2a8.4 8.4 0 0 1-3-.8v6.2a6.1 6.1 0 1 1-6.1-6.1c.3 0 .7 0 1 .1v3.3a2.9 2.9 0 1 0 1.9 2.7V3Z',
  },
  {
    name: 'Facebook',
    href: '#',
    svg: 'M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H7.7v3h2.7v8h3.1Z',
  },
  {
    name: 'YouTube',
    href: '#',
    svg: 'M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.4V8.6l6 3.4-6 3.4Z',
  },
]
</script>

<template>
  <footer class="overflow-hidden bg-[#0d271c] text-[#c8ddc4]">
    <!-- Main Footer Grid: 12-column layout giving maximum expansive width to the Map container -->
    <div class="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <!-- Col 1: Brand & Identity (3 of 12 columns) -->
        <div class="space-y-4 sm:col-span-1 lg:col-span-3">
          <NuxtLink
            to="/"
            class="group inline-flex items-center gap-3 text-white transition"
            aria-label="Balezaf Alcohol Liquors Factory PLC home"
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balezaf%20alcohol%20liquors%20factory%20plc%20LOGO-qsQOjEqqCnEubCgRx3GHDzu11GaPo2.png"
              alt="Balezaf Alcohol Liquors Factory PLC logo"
              class="h-12 w-12 rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-[#81ab71]"
            />
            <div>
              <span class="block text-sm font-semibold tracking-wider text-white">BALEZAF</span>
              <span class="block text-[10px] tracking-widest text-[#81ab71] uppercase">Alcohol &amp; Liquor Factory</span>
            </div>
          </NuxtLink>

          <p class="max-w-xs text-xs leading-relaxed text-[#a8c0a5]">
            {{ t.footer.tagline }}
          </p>

          <!-- Direct Contact Strip -->
          <div class="space-y-2 pt-1 text-xs text-[#d8e7d4]">
            <a
              href="tel:+251914300007"
              class="group flex items-center gap-2.5 transition hover:text-[#c6dfbc]"
            >
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] text-[#81ab71] group-hover:bg-[#81ab71] group-hover:text-[#0d271c] transition">
                📞
              </span>
              <span>+251 914 300 007</span>
            </a>

            <a
              href="mailto:destaalcohol@gmail.com"
              class="group flex items-center gap-2.5 transition hover:text-[#c6dfbc]"
            >
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] text-[#81ab71] group-hover:bg-[#81ab71] group-hover:text-[#0d271c] transition">
                ✉
              </span>
              <span>destaalcohol@gmail.com</span>
            </a>

            <p class="flex items-center gap-2.5 text-xs text-[#a8c0a5]">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] text-[#81ab71]">
                📍
              </span>
              <span>{{ t.topBar.location }}</span>
            </p>
          </div>
        </div>

        <!-- Col 2: Spirits Portfolio Quick Links (2 of 12 columns) -->
        <div class="sm:col-span-1 lg:col-span-2">
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9fc29a]">
            {{ t.footer.ourSpirits }}
          </p>
          <ul class="space-y-2">
            <li v-for="product in products.slice(0, 6)" :key="product.id">
              <NuxtLink
                to="/products"
                class="group flex items-center justify-between text-xs text-[#c8ddc4] transition-all hover:translate-x-1 hover:text-white"
              >
                <span class="truncate font-medium">{{ product.name }}</span>
                <span class="text-[10px] text-[#71986e] opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </NuxtLink>
            </li>
          </ul>

          <div class="mt-3.5 border-t border-white/10 pt-2.5">
            <NuxtLink
              to="/products"
              class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#81ab71] transition hover:text-[#c6dfbc]"
            >
              <span>{{ t.productsSec.viewAll }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Col 3: Exploration Links (2 of 12 columns) -->
        <div class="sm:col-span-1 lg:col-span-2">
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9fc29a]">
            {{ t.footer.explore }}
          </p>
          <ul class="space-y-2">
            <li v-for="link in exploreLinks.slice(0, 6)" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="group flex items-center justify-between text-xs text-[#c8ddc4] transition-all hover:translate-x-1 hover:text-white"
              >
                <span>{{ link.label }}</span>
                <span class="text-[10px] text-[#81ab71] opacity-0 transition-opacity group-hover:opacity-100">
                  ↗
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 4: EXPANSIVE Location Map & Visiting Hours (5 of 12 columns - Widened significantly!) -->
        <div class="sm:col-span-2 lg:col-span-5">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#9fc29a]">
              Distillery Location in Addis Ababa
            </p>
            <a
              href="https://www.openstreetmap.org/?mlat=9.00&amp;mlon=38.76#map=14/9.00/38.76"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[11px] font-semibold text-[#81ab71] transition hover:text-[#c6dfbc]"
            >
              Full Screen Map ↗
            </a>
          </div>

          <!-- Widened High-Definition Map Embed Container -->
          <div
            class="relative overflow-hidden rounded-2xl border border-white/20 bg-[#143929] shadow-xl transition-all duration-300 hover:border-[#81ab71]/50"
          >
            <iframe
              title="Balezaf Alcohol Liquors Factory PLC location map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=38.68%2C8.92%2C38.84%2C9.09&amp;layer=mapnik&amp;marker=9.00%2C38.76"
              class="h-52 w-full border-0 sm:h-56"
              loading="lazy"
            ></iframe>

            <!-- Quick Map Info Floating Strip -->
            <div
              class="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#0d271c]/95 px-4 py-2.5 text-[11px] text-[#d8e7d4] backdrop-blur-md"
            >
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-[#81ab71] animate-pulse"></span>
                <span class="font-medium text-white">Factory &amp; Bottling Plant</span>
                <span class="text-[#8daa8c]">· Addis Ababa</span>
              </div>

              <div class="text-[#a8c0a5]">
                <span>Mon – Sat: 8:30 AM – 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar: Social, Legal & Responsible Consumption -->
      <div
        class="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/15 pt-8 sm:flex-row"
      >
        <!-- Copyright & Responsibility note -->
        <div class="space-y-1 text-center sm:text-left">
          <p class="text-xs text-[#8daa8c]">
            © 2026 {{ t.footer.rights }}
          </p>
          <p class="text-[11px] text-[#6d8a6e]">
            {{ t.footer.disclaimer }}
          </p>
        </div>

        <!-- Social Media Buttons & Admin -->
        <div class="flex items-center gap-3" aria-label="Social media channels">
          <a
            v-for="social in socialLinks"
            :key="social.name"
            :href="social.href"
            :aria-label="social.name"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#c8ddc4] transition-all hover:scale-110 hover:border-[#81ab71] hover:bg-[#81ab71] hover:text-[#0d271c]"
          >
            <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path :d="social.svg" />
            </svg>
          </a>

          <!-- Admin Portal Quick Shortcut -->
          <NuxtLink
            to="/admin"
            class="ml-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
            title="Open Content Admin"
          >
            <span>Admin</span>
            <span aria-hidden="true">⚙</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
