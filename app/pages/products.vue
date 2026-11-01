<script setup lang="ts">
import { ref } from 'vue'
import ProductDetailModal, { type ProductDetail } from '~/components/ProductDetailModal.vue'
import { useProducts } from '~/composables/useProducts'

const { products } = useProducts()

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
            crafted for generous pours and memorable Ethiopian gatherings. Click any bottle for
            tasting profiles.
          </p>
        </div>
      </section>

      <!-- 10 Product Cards Grid with Modal Triggers -->
      <section class="px-6 py-16 lg:px-10 lg:py-24">
        <div class="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(product, index) in products"
            :key="product.name"
            class="group flex cursor-pointer flex-col justify-between rounded-[2rem] border border-[#dce8d7] bg-white p-8 shadow-[0_12px_35px_rgba(23,59,43,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#65975d]/50 hover:shadow-[0_20px_45px_rgba(23,59,43,0.12)]"
            @click="openProductModal(product)"
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
              <button
                type="button"
                class="inline-flex items-center text-sm font-semibold text-[#35653c] transition hover:text-[#173b2b]"
                @click.stop="openProductModal(product)"
              >
                <span>View tasting specs</span>
                <span class="ml-1.5" aria-hidden="true">↗</span>
              </button>

              <NuxtLink
                :to="`/order?product=${encodeURIComponent(product.name)}`"
                class="rounded-full bg-[#edf5e9] px-4 py-1.5 text-xs font-semibold text-[#2c6338] transition hover:bg-[#35653c] hover:text-white"
                @click.stop
              >
                Order
              </NuxtLink>
            </div>
          </article>
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
