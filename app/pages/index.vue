<script setup lang="ts">
import { reactive, ref } from 'vue'
import HeroBottleArc from '~/components/HeroBottleArc.vue'

import cognacImg from '~/assets/cognac.png'
import ginImg from '~/assets/gin.png'
import uozoImg from '~/assets/uozo.png'
import vodkaImg from '~/assets/vodka.png'
import zebibImg from '~/assets/zebib.png'

const featuredProducts = [
  {
    name: 'Desta Dry Gin',
    category: 'Signature Gin',
    abv: '40% Vol.',
    note: 'Crisp, botanical and clean with vibrant wild juniper',
    image: ginImg,
    badge: 'bg-[#e7f4e9] text-[#1f5a2b]',
  },
  {
    name: 'Desta Premium Vodka',
    category: 'Triple-Filtered',
    abv: '40% Vol.',
    note: 'Smooth with a refined grain finish and mountain purity',
    image: vodkaImg,
    badge: 'bg-[#e5f4f8] text-[#13495b]',
  },
  {
    name: 'Desta Ouzo',
    category: 'Traditional Anise',
    abv: '41% Vol.',
    note: 'Aromatic star anise with a crisp Mediterranean bloom',
    image: uozoImg,
    badge: 'bg-[#e7f1f8] text-[#154661]',
  },
  {
    name: 'Desta Zebib',
    category: 'Heritage Aperitif',
    abv: '43% Vol.',
    note: 'Ethiopia’s storied dry anise spirit with herbal richness',
    image: zebibImg,
    badge: 'bg-[#faf0df] text-[#6d4111]',
  },
  {
    name: 'Desta Fine Brandy',
    category: 'Oak-Aged Brandy',
    abv: '40% Vol.',
    note: 'Patiently matured in toasted oak for deep amber complexity',
    image: cognacImg,
    badge: 'bg-[#faece6] text-[#71280d]',
  },
]

const inquirySent = ref(false)
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
    <SiteHeader />

    <main id="top">
      <!-- Hero Section with Compact Viewport Fit -->
      <section class="relative overflow-hidden bg-[#123927] text-white">
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(129,171,113,.35),transparent_35%),linear-gradient(115deg,#123927_0%,#1d5539_56%,#467b55_100%)]"
        ></div>

        <div
          class="relative mx-auto grid max-w-7xl items-center gap-8 px-6 py-8 sm:py-10 lg:grid-cols-[1fr_1fr] lg:gap-10 lg:px-10 lg:py-12"
        >
          <!-- Left: Hero Headline & Description -->
          <div class="max-w-xl">
            <p
              class="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#c9e6c1]"
            >
              Made with patience · Bottled with purpose
            </p>

            <h1 class="font-serif text-4xl leading-[1.06] tracking-[-.03em] sm:text-5xl lg:text-6xl">
              The spirit of <em class="font-normal text-[#b8d7af]">good</em> making.
            </h1>

            <p class="mt-3.5 max-w-lg text-sm leading-relaxed text-[#d8e7d4] sm:text-base">
              Authentic Ethiopian spirits and craft liqueurs, distilled with local heritage and
              modern mastery. Explore the rotating collection below.
            </p>

            <div class="mt-6 flex flex-wrap items-center gap-3">
              <NuxtLink
                to="/order"
                class="rounded-full bg-[#c6dfbc] px-6 py-2.5 text-xs font-semibold text-[#173b2b] shadow-md transition-all hover:bg-white"
              >
                Place an order <span aria-hidden="true">↗</span>
              </NuxtLink>

              <NuxtLink
                to="/products"
                class="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Explore 10 products
              </NuxtLink>
            </div>

            <!-- Highlights counter -->
            <div
              class="mt-7 flex items-center gap-6 border-t border-white/15 pt-4 text-xs text-[#c9e6c1]"
            >
              <div>
                <strong class="block font-serif text-xl text-white">10+</strong>
                <span>Distinct Spirits</span>
              </div>
              <div class="h-7 w-px bg-white/20"></div>
              <div>
                <strong class="block font-serif text-xl text-white">1996</strong>
                <span>Distillery Heritage</span>
              </div>
              <div class="h-7 w-px bg-white/20"></div>
              <div>
                <strong class="block font-serif text-xl text-white">100%</strong>
                <span>Ethiopian Made</span>
              </div>
            </div>
          </div>

          <!-- Right: Interactive 3D Arc Bottle Carousel (Fits completely above the fold) -->
          <div class="w-full">
            <HeroBottleArc />
          </div>
        </div>
      </section>

      <!-- Story / Milestones Section -->
      <section id="story" class="mx-auto block w-[90%] max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pb-28">
        <div class="text-center">
          <p class="eyebrow">Our heritage</p>
          <h2 class="mt-3 font-serif text-3xl font-semibold sm:text-4xl">Distilled with pride in Addis Ababa</h2>
        </div>

        <div class="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          <div class="flex flex-col items-center rounded-2xl border border-[#e4ede1] bg-white p-6 text-center shadow-sm">
            <div class="flex items-center justify-center gap-2">
              <svg class="h-8 w-8 text-[#4f8a56]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M6 3h12v18H6z" /><path d="M9 7h6M9 11h6M9 15h6M9 19h3" />
              </svg>
              <strong class="font-serif text-3xl text-[#173b2b]">10</strong>
            </div>
            <span class="mt-2 text-xs font-semibold uppercase tracking-wider text-[#66816b]">Spirits</span>
            <p class="mt-2 text-xs leading-5 text-[#355944]">Signature gins, vodkas, ouzo, zebib, and fruit liqueurs.</p>
          </div>

          <div class="flex flex-col items-center rounded-2xl border border-[#e4ede1] bg-white p-6 text-center shadow-sm">
            <div class="flex items-center justify-center gap-2">
              <svg class="h-8 w-8 text-[#4f8a56]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" />
                <path d="M3 20c.6-3.3 2.2-5 5-5s4.4 1.7 5 5M11 20c.6-3.3 2.2-5 5-5s4.4 1.7 5 5" />
              </svg>
              <strong class="font-serif text-3xl text-[#173b2b]">80+</strong>
            </div>
            <span class="mt-2 text-xs font-semibold uppercase tracking-wider text-[#66816b]">Team members</span>
            <p class="mt-2 text-xs leading-5 text-[#355944]">Master distillers, botanists, bottlers, and logistics team.</p>
          </div>

          <div class="flex flex-col items-center rounded-2xl border border-[#e4ede1] bg-white p-6 text-center shadow-sm">
            <div class="flex items-center justify-center gap-2">
              <svg class="h-8 w-8 text-[#4f8a56]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 20V6l8-3 8 3v14" /><path d="M8 20v-5h8v5M8 9h.01M12 9h.01M16 9h.01" />
              </svg>
              <strong class="font-serif text-3xl text-[#173b2b]">2012</strong>
            </div>
            <span class="mt-2 text-xs font-semibold uppercase tracking-wider text-[#66816b]">Modern plant</span>
            <p class="mt-2 text-xs leading-5 text-[#355944]">Upgraded state-of-the-art automated distillation lines.</p>
          </div>

          <div class="flex flex-col items-center rounded-2xl border border-[#e4ede1] bg-white p-6 text-center shadow-sm">
            <div class="flex items-center justify-center gap-2">
              <svg class="h-8 w-8 text-[#4f8a56]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 21V9l9-5 9 5v12" /><path d="M7 21v-7h10v7M7 10h10M10 17h4" />
              </svg>
              <strong class="font-serif text-3xl text-[#173b2b]">2</strong>
            </div>
            <span class="mt-2 text-xs font-semibold uppercase tracking-wider text-[#66816b]">Warehouses</span>
            <p class="mt-2 text-xs leading-5 text-[#355944]">Dedicated climate-controlled storage for purity.</p>
          </div>

          <div class="flex flex-col items-center rounded-2xl border border-[#e4ede1] bg-white p-6 text-center shadow-sm">
            <div class="flex items-center justify-center gap-2">
              <svg class="h-8 w-8 text-[#4f8a56]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 20h18M5 20V9l4-4 4 4v11M13 20v-7l3-3 3 3v7" /><path d="M8 12h2M8 16h2M16 14h.01M19 14h.01" />
              </svg>
              <strong class="font-serif text-3xl text-[#173b2b]">1</strong>
            </div>
            <span class="mt-2 text-xs font-semibold uppercase tracking-wider text-[#66816b]">Production plant</span>
            <p class="mt-2 text-xs leading-5 text-[#355944]">Purpose-built facilities for thoughtful Ethiopian craft.</p>
          </div>
        </div>
      </section>

      <!-- Products Collection Section with Actual Bottle Images -->
      <section id="products" class="bg-[#173b2b] px-6 py-24 text-white lg:px-10 lg:py-28">
        <div class="mx-auto max-w-7xl">
          <div class="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p class="eyebrow text-[#b8d7af]">The collection</p>
              <h2 class="mt-3 font-serif text-4xl sm:text-5xl">
                Made for your <em class="font-normal text-[#b8d7af]">ritual.</em>
              </h2>
            </div>
            <NuxtLink
              to="/products"
              class="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white hover:text-[#173b2b]"
            >
              View complete portfolio ↗
            </NuxtLink>
          </div>

          <!-- Featured Grid with Real Bottle Images -->
          <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="product in featuredProducts"
              :key="product.name"
              class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#1d4533] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#81ab71]/40 hover:shadow-2xl"
            >
              <div class="flex items-center justify-between">
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="product.badge">
                  {{ product.category }}
                </span>
                <span class="text-xs font-medium text-[#c9e6c1]">{{ product.abv }}</span>
              </div>

              <!-- Bottle Image Showcase -->
              <div class="relative my-6 flex h-60 items-center justify-center">
                <div class="absolute h-36 w-36 rounded-full bg-white/5 blur-2xl group-hover:bg-[#81ab71]/20 transition-all"></div>
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="relative z-10 h-56 w-auto max-w-[150px] object-contain drop-shadow-xl transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div>
                <h3 class="font-serif text-2xl font-semibold text-white">{{ product.name }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-[#c9dec8]">{{ product.note }}</p>
                <div class="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <NuxtLink
                    :to="`/order?product=${encodeURIComponent(product.name)}`"
                    class="text-xs font-semibold text-[#c6dfbc] transition hover:text-white"
                  >
                    Order bottle →
                  </NuxtLink>
                  <NuxtLink
                    to="/contact"
                    class="text-xs text-[#a2c29f] transition hover:text-white"
                  >
                    Product specs ↗
                  </NuxtLink>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Inquiry / Contact Section -->
      <section
        id="contact"
        class="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:py-32"
      >
        <div>
          <p class="eyebrow">Let&apos;s talk</p>
          <h2 class="mt-4 max-w-md font-serif text-4xl leading-tight sm:text-5xl">
            Bring a little more <em class="text-[#65975d]">spirit</em> to the table.
          </h2>
          <p class="mt-5 max-w-md text-base leading-relaxed text-[#66816b]">
            For wholesale orders, retail distribution, partnerships, or bottle queries, our distillery
            team is here for you.
          </p>

          <div class="mt-8 space-y-3 text-sm text-[#355944]">
            <p class="flex items-center gap-3">
              <span class="text-[#65975d]">✦</span> Addis Ababa, Ethiopia
            </p>
            <p class="flex items-center gap-3">
              <span class="text-[#65975d]">✦</span> +251 914 300 007
            </p>
            <p class="flex items-center gap-3">
              <span class="text-[#65975d]">✦</span> destaalcohol@gmail.com
            </p>
          </div>
        </div>

        <form
          class="rounded-3xl border border-[#dce8d7] bg-[#f1f6ed] p-7 sm:p-10 shadow-sm"
          @submit.prevent="submitInquiry"
        >
          <div
            v-if="inquirySent"
            class="mb-6 rounded-xl border border-[#b8d7af] bg-white p-4 text-sm text-[#35653c]"
          >
            Thanks — your inquiry has been received. We&apos;ll be in touch shortly.
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <label class="text-sm font-medium">
              Name
              <input v-model="inquiry.name" required class="field" placeholder="Your name" />
            </label>
            <label class="text-sm font-medium">
              Email
              <input
                v-model="inquiry.email"
                required
                type="email"
                class="field"
                placeholder="you@company.com"
              />
            </label>
          </div>

          <label class="mt-5 block text-sm font-medium">
            How can we help?
            <textarea
              v-model="inquiry.message"
              required
              class="field min-h-32 resize-y"
              placeholder="Tell us about your order or partnership"
            ></textarea>
          </label>

          <button
            type="submit"
            class="mt-6 rounded-full bg-[#173b2b] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#35653c]"
          >
            Send inquiry <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
