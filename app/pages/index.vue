<script setup lang="ts">
import { reactive, ref } from 'vue'
import HeroBottleArc from '~/components/HeroBottleArc.vue'
import ProductDetailModal, { type ProductDetail } from '~/components/ProductDetailModal.vue'
import { useProducts } from '~/composables/useProducts'

const { topProducts } = useProducts()

// Modal state
const isModalOpen = ref(false)
const selectedProduct = ref<ProductDetail | null>(null)

function openProductModal(product: ProductDetail) {
  selectedProduct.value = product
  isModalOpen.value = true
}

function closeProductModal() {
  isModalOpen.value = false
  selectedProduct.value = null
}

// 5 Heritage Milestones with responsive column configuration
const milestones = [
  {
    value: '10',
    label: 'Spirits & Liqueurs',
    desc: 'Signature gins, vodkas, ouzo, zebib, and fruit liqueurs.',
    mobileSpan: 'col-span-1',
    tabletSpan: 'sm:col-span-2',
    iconType: 'bottle',
  },
  {
    value: '80+',
    label: 'Team Members',
    desc: 'Master distillers, botanists, bottlers, and distribution crew.',
    mobileSpan: 'col-span-1',
    tabletSpan: 'sm:col-span-2',
    iconType: 'team',
  },
  {
    value: '2012',
    label: 'Modern Plant',
    desc: 'Upgraded automated distillation and high-precision bottling lines.',
    mobileSpan: 'col-span-1',
    tabletSpan: 'sm:col-span-2',
    iconType: 'plant',
  },
  {
    value: '2',
    label: 'Warehouses',
    desc: 'Climate-controlled secure storage for batch purity.',
    mobileSpan: 'col-span-1',
    tabletSpan: 'sm:col-span-3',
    iconType: 'warehouse',
  },
  {
    value: '1',
    label: 'Production Plant',
    desc: 'Purpose-built Addis Ababa facilities for thoughtful Ethiopian craft.',
    mobileSpan: 'col-span-2',
    tabletSpan: 'sm:col-span-3',
    iconType: 'factory',
  },
]

// Customer & Hospitality Partner Testimonials
const customerTestimonials = [
  {
    quote: 'Desta Gin has become the permanent crown jewel on our signature cocktail menu. The wild highland kosoret and citrus aroma profile astonishes international diplomats and guests who never realized Ethiopia was producing botanical spirits of this world-class caliber.',
    author: 'Yared Mengistu',
    title: 'Head Beverage Director',
    establishment: 'The Skylight Luxury Hotel, Addis Ababa',
    rating: 5,
    badge: 'Luxury Hospitality Partner',
    initials: 'YM',
  },
  {
    quote: 'Their Zebib is without question the cleanest anise spirit I have ever poured. When crafting signature aperitifs, the silky mouthfeel and clean clouding louche effect are flawless. It bridges traditional Ethiopian banquets with modern craft mixology seamlessly.',
    author: 'Samrawit Fekadu',
    title: 'Lead Mixologist & Bar Manager',
    establishment: 'Bole Sky Lounge & Cocktail Bar',
    rating: 5,
    badge: 'Craft Cocktail Bar',
    initials: 'SF',
  },
  {
    quote: 'From supply-chain reliability to zero bottle variance across pallet shipments, Balezaf is our most dependable domestic partner. Their packaging aesthetics and industrial quality control rival top European spirit imports.',
    author: 'Tewodros Haile',
    title: 'General Manager of Procurement',
    establishment: 'Rift Valley Beverage Distributors',
    rating: 5,
    badge: 'National Distribution Partner',
    initials: 'TH',
  },
]

const partnerMetrics = [
  { value: '450+', label: 'Hospitality Venues', desc: 'Hotels, bars, and resorts serving Balezaf nationwide' },
  { value: '4.9 / 5', label: 'Average Quality Rating', desc: 'Across blind sommelier panels and bar managers' },
  { value: '99.8%', label: 'On-Time Fulfillment', desc: 'Fulfillment accuracy across regional wholesale orders' },
  { value: '100%', label: 'Ethiopian Terroir', desc: 'Locally sourced grains and wild mountain botanicals' },
]

const inquirySent = ref(false)

const submitInquiry = async (FormD: any, form$: any) => {
  try {
    inquirySent.value = true
    frontEndErrorFeedback().success('Thanks! Your inquiry has been received.')
  } catch (error) {
    frontEndErrorFeedback().err(error)
  }
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
                Explore all 10 products
              </NuxtLink>
            </div>

            <!-- Highlights counter -->
            <div
              class="mt-7 flex items-center gap-6 border-t border-white/15 pt-4 text-xs text-[#c9e6c1]"
            >
              <div>
                <strong class="block font-serif text-xl text-white">10</strong>
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

      <!-- Story / Heritage Milestones Section (Responsive Grid for all screen sizes) -->
      <section id="story" class="mx-auto block w-full max-w-7xl px-5 pb-20 pt-16 sm:px-6 lg:px-10 lg:pb-28">
        <div class="text-center">
          <p class="eyebrow">Our heritage</p>
          <h2 class="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Distilled with pride in Addis Ababa
          </h2>
          <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#54715a]">
            Decades of craftsmanship and dedicated infrastructure behind every bottle.
          </p>
        </div>

        <!-- Fully Responsive Cards Grid -->
        <div
          class="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-6 sm:gap-5 lg:grid-cols-5 lg:gap-6"
        >
          <div
            v-for="item in milestones"
            :key="item.label"
            class="group flex flex-col items-center justify-between rounded-2xl border border-[#dce8d7] bg-white p-5 text-center shadow-[0_4px_16px_rgba(23,59,43,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#65975d]/50 hover:shadow-[0_12px_28px_rgba(23,59,43,0.08)] sm:p-6"
            :class="[item.mobileSpan, item.tabletSpan, 'lg:col-span-1']"
          >
            <!-- Card Header: Icon in soft circle badge -->
            <div class="flex flex-col items-center">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf5e9] text-[#3e7647] transition-colors group-hover:bg-[#3e7647] group-hover:text-white"
              >
                <!-- Bottle icon -->
                <svg
                  v-if="item.iconType === 'bottle'"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path d="M6 3h12v18H6z" />
                  <path d="M9 7h6M9 11h6M9 15h6M9 19h3" />
                </svg>

                <!-- Team icon -->
                <svg
                  v-else-if="item.iconType === 'team'"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <circle cx="8" cy="8" r="3" />
                  <circle cx="16" cy="8" r="3" />
                  <path d="M3 20c.6-3.3 2.2-5 5-5s4.4 1.7 5 5M11 20c.6-3.3 2.2-5 5-5s4.4 1.7 5 5" />
                </svg>

                <!-- Modern Plant icon -->
                <svg
                  v-else-if="item.iconType === 'plant'"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path d="M4 20V6l8-3 8 3v14" />
                  <path d="M8 20v-5h8v5M8 9h.01M12 9h.01M16 9h.01" />
                </svg>

                <!-- Warehouse icon -->
                <svg
                  v-else-if="item.iconType === 'warehouse'"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path d="M3 21V9l9-5 9 5v12" />
                  <path d="M7 21v-7h10v7M7 10h10M10 17h4" />
                </svg>

                <!-- Factory / Production icon -->
                <svg
                  v-else
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path d="M3 20h18M5 20V9l4-4 4 4v11M13 20v-7l3-3 3 3v7" />
                  <path d="M8 12h2M8 16h2M16 14h.01M19 14h.01" />
                </svg>
              </div>

              <!-- Metric Stat Number -->
              <strong class="mt-3.5 block font-serif text-3xl font-bold tracking-tight text-[#173b2b] sm:text-4xl">
                {{ item.value }}
              </strong>

              <!-- Metric Label -->
              <span class="mt-1 block text-xs font-semibold uppercase tracking-wider text-[#66816b]">
                {{ item.label }}
              </span>
            </div>

            <!-- Card Description -->
            <p class="mt-2 text-xs leading-relaxed text-[#355944]">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </section>

      <!-- Products Collection Section: Top 3 Most Popular Flagships -->
      <section id="products" class="bg-[#173b2b] px-6 py-20 text-white lg:px-10 lg:py-24">
        <div class="mx-auto max-w-7xl">
          <div class="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p class="eyebrow text-[#b8d7af]">Top flagships</p>
              <h2 class="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl">
                Crafted for your <em class="font-normal text-[#b8d7af]">ritual.</em>
              </h2>
              <p class="mt-2 text-sm text-[#c9dec8]">
                Three of our most celebrated Ethiopian spirits. Click any card for detailed notes.
              </p>
            </div>
            <NuxtLink
              to="/products"
              class="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white hover:text-[#173b2b]"
            >
              View all 10 products ↗
            </NuxtLink>
          </div>

          <!-- Exactly 3 Balanced Product Cards with Clickable Modal Trigger -->
          <div class="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 sm:gap-6 lg:gap-8">
            <article
              v-for="product in topProducts"
              :key="product.name"
              class="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#1d4533] p-5 transition duration-300 hover:-translate-y-1.5 hover:border-[#81ab71]/50 hover:shadow-2xl sm:rounded-3xl sm:p-6 lg:p-7"
              @click="openProductModal(product)"
            >
              <div class="flex items-center justify-between">
                <span class="rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:px-3 sm:py-1 sm:text-xs" :class="product.badge">
                  {{ product.category }}
                </span>
                <span class="text-xs font-medium text-[#c9e6c1]">{{ product.abv }}</span>
              </div>

              <!-- Product Bottle Image Showcase -->
              <div class="relative my-4 flex h-52 items-center justify-center sm:my-6 sm:h-60 lg:h-64">
                <div
                  class="absolute h-36 w-36 rounded-full bg-white/5 blur-2xl transition-all group-hover:scale-125 group-hover:bg-[#81ab71]/20 sm:h-40 sm:w-40"
                ></div>
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="relative z-10 h-48 w-auto max-w-[125px] object-contain drop-shadow-2xl transition duration-500 group-hover:scale-105 sm:h-56 sm:max-w-[145px] lg:h-60 lg:max-w-[155px]"
                  loading="lazy"
                />
              </div>

              <div>
                <div class="flex items-center justify-between">
                  <h3 class="font-serif text-xl font-semibold text-white sm:text-2xl">{{ product.name }}</h3>
                  <span
                    class="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#c9e6c1] opacity-0 transition duration-300 group-hover:opacity-100"
                  >
                    View specs
                  </span>
                </div>
                <p class="mt-1.5 text-xs leading-relaxed text-[#c9dec8] sm:text-sm">{{ product.note }}</p>

                <div class="mt-5 flex items-center justify-between border-t border-white/10 pt-3.5 sm:mt-6 sm:pt-4">
                  <NuxtLink
                    :to="`/order?product=${encodeURIComponent(product.name)}`"
                    class="text-xs font-semibold text-[#c6dfbc] transition hover:text-white"
                    @click.stop
                  >
                    Order bottle →
                  </NuxtLink>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-xs text-[#a2c29f] transition hover:text-white"
                    @click.stop="openProductModal(product)"
                  >
                    <span>Full notes</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Customer & Hospitality Partner Testimonials Section -->
      <section class="border-y border-[#dce8d7] bg-[#f8faf5] px-6 py-20 lg:px-10 lg:py-28">
        <div class="mx-auto max-w-7xl">
          <div class="max-w-3xl">
            <p class="eyebrow text-[#65975d]">Partner &amp; Customer Voices</p>
            <h2 class="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl text-[#173b2b]">
              Trusted on Ethiopia’s <em class="font-normal text-[#65975d]">finest tables.</em>
            </h2>
            <p class="mt-4 text-sm sm:text-base leading-relaxed text-[#43654e]">
              From five-star diplomatic hotel lounges in Addis Ababa to premier craft cocktail bars and regional wholesale distributors—hear how our spirits elevate hospitality rituals across Ethiopia.
            </p>
          </div>

          <!-- Testimonial Cards Grid -->
          <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="item in customerTestimonials"
              :key="item.author"
              class="flex flex-col justify-between rounded-3xl border border-[#dfe9da] bg-white p-7 sm:p-8 shadow-xs transition hover:shadow-xl hover:border-[#65975d]/40"
            >
              <div>
                <!-- Rating Stars & Badge -->
                <div class="flex items-center justify-between">
                  <div class="flex text-amber-500 text-sm tracking-wider" aria-label="5 out of 5 stars">
                    ★★★★★
                  </div>
                  <span class="rounded-full bg-[#edf5e9] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#285736]">
                    {{ item.badge }}
                  </span>
                </div>

                <!-- Quote text -->
                <blockquote class="mt-5 font-serif text-base italic leading-relaxed text-[#173b2b]">
                  “{{ item.quote }}”
                </blockquote>
              </div>

              <!-- Author Info -->
              <div class="mt-8 flex items-center gap-3.5 border-t border-[#edf3ea] pt-5">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#173b2b] text-xs font-bold text-[#c6dfbc]">
                  {{ item.initials }}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-[#173b2b]">{{ item.author }}</h4>
                  <p class="text-xs text-[#527359]">{{ item.title }}</p>
                  <p class="text-[11px] font-semibold text-[#718e75]">{{ item.establishment }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Trust & Distribution Metrics -->
          <div class="mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-[#dce8d7] bg-white p-6 sm:grid-cols-4 sm:p-8">
            <div
              v-for="m in partnerMetrics"
              :key="m.label"
              class="text-center"
            >
              <strong class="font-serif text-2xl sm:text-3xl font-bold text-[#285736]">{{ m.value }}</strong>
              <span class="mt-1 block text-xs font-bold uppercase tracking-wider text-[#173b2b]">{{ m.label }}</span>
              <p class="mt-1 text-[11px] text-[#6b8970] hidden sm:block">{{ m.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Inquiry / Contact Section -->
      <section
        id="contact"
        class="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:py-28"
      >
        <div>
          <p class="eyebrow">Let&apos;s talk</p>
          <h2 class="mt-4 max-w-md font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Bring a little more <em class="text-[#65975d]">spirit</em> to the table.
          </h2>
          <p class="mt-4 max-w-md text-sm leading-relaxed text-[#66816b] sm:text-base">
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

        <div class="rounded-3xl border border-[#dce8d7] bg-[#f1f6ed] p-7 sm:p-10 shadow-sm">
          <div
            v-if="inquirySent"
            class="mb-6 rounded-xl border border-[#b8d7af] bg-white p-4 text-sm text-[#35653c]"
          >
            Thanks — your inquiry has been received. We&apos;ll be in touch shortly.
          </div>

          <ClientOnly>
            <Vueform :endpoint="submitInquiry">
              <TextElement
                name="name"
                label="Name"
                placeholder="Your name"
                :columns="{ container: 6 }"
                :rules="['required']"
              />
              <TextElement
                name="email"
                input-type="email"
                label="Email"
                placeholder="you@company.com"
                :columns="{ container: 6 }"
                :rules="['required', 'email']"
              />
              <TextareaElement
                name="message"
                label="How can we help?"
                placeholder="Tell us about your order or partnership"
                :rows="4"
                :rules="['required']"
              />
              <ButtonElement
                name="submit"
                button-label="Send inquiry ↗"
                :submits="true"
              />
            </Vueform>
          </ClientOnly>
        </div>
      </section>
    </main>

    <!-- Product Detail Modal -->
    <ProductDetailModal
      :is-open="isModalOpen"
      :product="selectedProduct"
      @close="closeProductModal"
    />

    <SiteFooter />
  </div>
</template>
