<script setup lang="ts">
import ananasImg from '~/assets/ananas.png'
import appleImg from '~/assets/apple.png'
import aprativeImg from '~/assets/aprative.png'
import coffeeImg from '~/assets/coffee.png'
import cognacImg from '~/assets/cognac.png'
import ginImg from '~/assets/gin.png'
import limeImg from '~/assets/lime.png'
import uozoImg from '~/assets/uozo.png'
import vodkaImg from '~/assets/vodka.png'
import zebibImg from '~/assets/zebib.png'

const products = [
  {
    name: 'Desta Dry Gin',
    type: 'London Dry Gin',
    abv: '40% Vol.',
    volume: '750ml',
    note: 'Juniper-led botanical spirit with bright highland citrus and coriander finish.',
    image: ginImg,
    badge: 'bg-[#e7f4e9] text-[#1f5a2b]',
  },
  {
    name: 'Desta Premium Vodka',
    type: 'Triple-Filtered Vodka',
    abv: '40% Vol.',
    volume: '750ml',
    note: 'Clean, exceptionally smooth grain spirit distilled with mountain spring water.',
    image: vodkaImg,
    badge: 'bg-[#e5f4f8] text-[#13495b]',
  },
  {
    name: 'Desta Ouzo',
    type: 'Traditional Anise Spirit',
    abv: '41% Vol.',
    volume: '750ml',
    note: 'Classic Mediterranean-style star anise spirit with an authentic milky louche bloom.',
    image: uozoImg,
    badge: 'bg-[#e7f1f8] text-[#154661]',
  },
  {
    name: 'Desta Zebib',
    type: 'Heritage Dry Anise',
    abv: '43% Vol.',
    volume: '750ml',
    note: 'Ethiopia’s signature celebratory spirit crafted from distilled grape alcohol and aniseed.',
    image: zebibImg,
    badge: 'bg-[#faf0df] text-[#6d4111]',
  },
  {
    name: 'Desta Fine Brandy',
    type: 'Oak-Aged Brandy / Cognac',
    abv: '40% Vol.',
    volume: '750ml',
    note: 'Patiently matured in French oak casks with rich dried fruit, vanilla, and spice notes.',
    image: cognacImg,
    badge: 'bg-[#faece6] text-[#71280d]',
  },
  {
    name: 'Desta Coffee Liqueur',
    type: 'Arabica Coffee Liqueur',
    abv: '24% Vol.',
    volume: '750ml',
    note: 'Single-origin roasted Ethiopian highland Arabica beans infused with raw cane syrup.',
    image: coffeeImg,
    badge: 'bg-[#f6eee9] text-[#4d2512]',
  },
  {
    name: 'Desta Ananas Liqueur',
    type: 'Tropical Pineapple Liqueur',
    abv: '24% Vol.',
    volume: '750ml',
    note: 'Sun-drenched tropical pineapple spirit with vibrant natural sweetness and fruit aroma.',
    image: ananasImg,
    badge: 'bg-[#faf5de] text-[#694806]',
  },
  {
    name: 'Desta Apple Liqueur',
    type: 'Orchard Apple Liqueur',
    abv: '24% Vol.',
    volume: '750ml',
    note: 'Crisp highland apples pressed and steeped for refreshing natural fruit zest.',
    image: appleImg,
    badge: 'bg-[#fbecea] text-[#6b1e16]',
  },
  {
    name: 'Desta Lime Spirit',
    type: 'Highland Lime Spirit',
    abv: '28% Vol.',
    volume: '750ml',
    note: 'Zesty cold-pressed citrus oils and refreshing lemongrass aroma on a crisp palate.',
    image: limeImg,
    badge: 'bg-[#f3f9e7] text-[#36510d]',
  },
  {
    name: 'Desta Aperitif',
    type: 'Botanical Bitter-Sweet',
    abv: '20% Vol.',
    volume: '750ml',
    note: 'Harmonious blend of gentian root, bitter orange peel, and highland botanicals.',
    image: aprativeImg,
    badge: 'bg-[#faebeb] text-[#6a1515]',
  },
]

useSeoMeta({
  title: 'Products | Desta Spirits & Liqueurs',
  description: 'Explore the complete 10-bottle portfolio of spirits and craft liqueurs made in Ethiopia.',
})
</script>

<template>
  <div class="min-h-screen bg-[#fffdf9] text-[#173b2b]">
    <SiteHeader />

    <main>
      <!-- Page Hero -->
      <section class="bg-[#edf5e9] px-6 py-20 lg:px-10 lg:py-28">
        <div class="mx-auto max-w-7xl">
          <p class="text-xs font-semibold uppercase tracking-[0.25em] text-[#65975d]">
            Our portfolio
          </p>
          <h1 class="mt-4 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] lg:text-7xl">
            Spirits with a sense of place.
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-[#54715a]">
            From crisp London dry gin to rich aged brandy and fruit liqueurs, every bottle is
            crafted for generous pours and memorable Ethiopian gatherings.
          </p>
        </div>
      </section>

      <!-- 10 Product Cards Grid -->
      <section class="px-6 py-16 lg:px-10 lg:py-24">
        <div class="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(product, index) in products"
            :key="product.name"
            class="group flex flex-col justify-between rounded-[2rem] border border-[#dce8d7] bg-white p-8 shadow-[0_12px_35px_rgba(23,59,43,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#65975d]/50 hover:shadow-[0_20px_45px_rgba(23,59,43,0.12)]"
          >
            <div>
              <div class="flex items-start justify-between">
                <span class="font-serif text-sm font-semibold text-[#8eaa86]">
                  {{ index < 9 ? `0${index + 1}` : index + 1 }}
                </span>
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="product.badge">
                  {{ product.type }}
                </span>
              </div>

              <!-- Product Bottle Display -->
              <div class="relative my-6 flex h-64 items-center justify-center">
                <div
                  class="absolute h-40 w-40 rounded-full bg-[#edf5e9] blur-xl transition-all duration-500 group-hover:scale-125"
                ></div>
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="relative z-10 h-60 w-auto max-w-[155px] object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-[#7c9780]">{{ product.abv }}</span>
                <span class="text-xs text-[#b8cdb6]">·</span>
                <span class="text-xs font-medium text-[#7c9780]">{{ product.volume }}</span>
              </div>

              <h2 class="mt-2 font-serif text-2xl font-semibold text-[#173b2b]">
                {{ product.name }}
              </h2>
              <p class="mt-3 text-sm leading-relaxed text-[#6c8270]">{{ product.note }}</p>
            </div>

            <div class="mt-8 flex items-center justify-between border-t border-[#edf3ea] pt-5">
              <NuxtLink
                :to="`/order?product=${encodeURIComponent(product.name)}`"
                class="inline-flex text-sm font-semibold text-[#35653c] transition hover:text-[#173b2b]"
              >
                Place order <span class="ml-1.5" aria-hidden="true">↗</span>
              </NuxtLink>
              <NuxtLink
                to="/contact"
                class="text-xs text-[#8eaa86] transition hover:text-[#35653c]"
              >
                Distributor enquiry →
              </NuxtLink>
            </div>
          </article>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
