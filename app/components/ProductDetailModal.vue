<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'

export interface ProductDetail {
  name: string
  category: string
  abv: string
  volume: string
  tagline?: string
  note: string
  image: string
  color?: string
  glowColor?: string
  badge?: string
  aroma?: string
  palate?: string
  finish?: string
  ingredients?: string
  serving?: string
}

const props = defineProps<{
  product: ProductDetail | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function close() {
  emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    close()
  }
}

// Lock background scroll when modal is open
watch(
  () => props.isOpen,
  (open) => {
    if (typeof document !== 'undefined') {
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && product"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="product.name"
      >
        <!-- Backdrop Blur overlay -->
        <div
          class="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
          @click="close"
        ></div>

        <!-- Modal Dialog Box -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-3"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div
            v-if="isOpen && product"
            class="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-[#dce8d7] bg-[#fffdf9] text-[#173b2b] shadow-[0_25px_60px_-15px_rgba(23,59,43,0.35)] md:flex-row"
            @click.stop
          >
            <!-- Close Button (Top right on mobile, top right on desktop) -->
            <button
              type="button"
              class="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[#173b2b] backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-black active:scale-95"
              aria-label="Close details"
              @click="close"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <!-- Left Showcase Column: Bottle & Lighting Pedestal -->
            <div
              class="relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-b from-[#143d2a] via-[#1a4a34] to-[#123624] p-8 md:w-[44%]"
            >
              <!-- Dynamic radial glow matching product color -->
              <div
                class="absolute h-56 w-56 rounded-full blur-[70px] opacity-70"
                :style="{ backgroundColor: product.glowColor || 'rgba(129,171,113,0.45)' }"
              ></div>

              <!-- Pedestal circle -->
              <div
                class="absolute bottom-6 h-8 w-44 rounded-full bg-black/40 blur-md"
              ></div>
              <div
                class="absolute bottom-7 h-4 w-28 rounded-full border border-white/20 bg-white/10 blur-xs"
              ></div>

              <!-- High-res Bottle Image -->
              <img
                :src="product.image"
                :alt="product.name"
                class="relative z-10 h-64 w-auto max-w-[170px] object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.65)] transition-transform duration-500 hover:scale-105 sm:h-76 md:h-80"
              />

              <!-- Bottom Amharic / Origin Badge -->
              <div
                class="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-semibold tracking-wider text-[#d8e7d4] backdrop-blur-md"
              >
                Distilled in Addis Ababa · Ethiopia
              </div>
            </div>

            <!-- Right Content Column: Detailed Product Profile -->
            <div class="flex flex-1 flex-col justify-between overflow-y-auto p-6 sm:p-8">
              <div>
                <!-- Metadata unboxed strip -->
                <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#54715a]">
                  <span class="rounded-full bg-[#edf5e9] px-2.5 py-0.5 text-[#2c6338]">
                    {{ product.category }}
                  </span>
                  <span aria-hidden="true" class="text-[#a4bca9]">·</span>
                  <span>{{ product.abv }}</span>
                  <span aria-hidden="true" class="text-[#a4bca9]">·</span>
                  <span>{{ product.volume || '750ml' }}</span>
                </div>

                <!-- Product Name -->
                <h2 class="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#173b2b]">
                  {{ product.name }}
                </h2>

                <!-- Main Tasting Note / Tagline -->
                <p class="mt-2 text-sm leading-relaxed text-[#54715a]">
                  {{ product.note }}
                </p>

                <!-- Detailed Tasting Profile Specs -->
                <div class="mt-5 space-y-3 rounded-2xl border border-[#e4ede1] bg-[#f9fbf7] p-4 text-xs">
                  <div v-if="product.aroma" class="grid grid-cols-[70px_1fr] gap-2">
                    <span class="font-semibold uppercase tracking-wider text-[#66816b]">Nose</span>
                    <span class="text-[#20402e]">{{ product.aroma }}</span>
                  </div>

                  <div v-if="product.palate" class="grid grid-cols-[70px_1fr] gap-2">
                    <span class="font-semibold uppercase tracking-wider text-[#66816b]">Palate</span>
                    <span class="text-[#20402e]">{{ product.palate }}</span>
                  </div>

                  <div v-if="product.finish" class="grid grid-cols-[70px_1fr] gap-2">
                    <span class="font-semibold uppercase tracking-wider text-[#66816b]">Finish</span>
                    <span class="text-[#20402e]">{{ product.finish }}</span>
                  </div>

                  <div v-if="product.serving" class="grid grid-cols-[70px_1fr] gap-2 border-t border-[#e4ede1] pt-2.5">
                    <span class="font-semibold uppercase tracking-wider text-[#66816b]">Serve</span>
                    <span class="text-[#20402e]">{{ product.serving }}</span>
                  </div>
                </div>
              </div>

              <!-- CTAs: Order & Wholesale Inquiry -->
              <div class="mt-6 flex flex-wrap items-center gap-3 border-t border-[#edf3ea] pt-5">
                <NuxtLink
                  :to="`/order?product=${encodeURIComponent(product.name)}`"
                  class="flex-1 rounded-full bg-[#173b2b] px-6 py-3 text-center text-xs font-semibold text-white shadow-md transition-all hover:bg-[#35653c] hover:shadow-lg active:scale-95"
                  @click="close"
                >
                  Order This Bottle <span aria-hidden="true">↗</span>
                </NuxtLink>

                <NuxtLink
                  to="/contact"
                  class="rounded-full border border-[#dce8d7] bg-white px-5 py-3 text-center text-xs font-semibold text-[#173b2b] transition-all hover:bg-[#edf5e9]"
                  @click="close"
                >
                  Wholesale Enquiry
                </NuxtLink>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
