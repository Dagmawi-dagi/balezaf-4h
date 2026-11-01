<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useProducts } from '~/composables/useProducts'

const { products: bottles } = useProducts()

const activeIndex = ref(0)
const isAutoRotating = ref(true)
let autoRotateTimer: any = null

const activeBottle = computed(() => {
  if (!bottles.value || bottles.value.length === 0) {
    return {
      id: 'default',
      name: 'Desta Spirit',
      category: 'Signature Spirit',
      volume: '750ml',
      abv: '40% Vol.',
      tagline: 'Crafted in Ethiopia.',
      image: '',
      color: '#52965b',
      glowColor: 'rgba(82, 150, 91, 0.4)',
    }
  }
  return bottles.value[activeIndex.value % bottles.value.length]
})

function nextBottle() {
  if (bottles.value.length === 0) return
  activeIndex.value = (activeIndex.value + 1) % bottles.value.length
}

function prevBottle() {
  if (bottles.value.length === 0) return
  activeIndex.value = (activeIndex.value - 1 + bottles.value.length) % bottles.value.length
}

function selectBottle(index: number) {
  activeIndex.value = index
}

// Compact Arc geometric math for proportional viewport fit
function getBottleTransform(index: number) {
  const count = bottles.value.length || 10
  let diff = (index - activeIndex.value) % count
  if (diff > count / 2) diff -= count
  if (diff < -count / 2) diff += count

  // Spacing angle along the circular arc
  const angle = diff * 0.48
  // Horizontal spread: comfortable 215px max offset so bottles don't clip container
  const x = Math.sin(angle) * 215
  // Curve downward as bottles recede to form the arc
  const y = (1 - Math.cos(angle)) * 38
  const z = Math.cos(angle) * 60

  const absDiff = Math.abs(diff)
  const isCenter = absDiff < 0.1

  // Scale: center bottle is prominent (1.18x), receding bottles shrink smoothly (0.72x)
  const scale = isCenter ? 1.18 : Math.max(0.68, 0.98 - absDiff * 0.14)

  // Blur: active bottle crystal clear, side bottles softly blur
  const blur = isCenter ? 0 : Math.min(absDiff * 2.2, 5.5)

  // Opacity: center is 1, background bottles stay subtly visible
  const opacity = isCenter ? 1 : Math.max(0.24, 0.9 - absDiff * 0.22)

  // Gentle rotational tilt along the arc
  const rotateDeg = diff * 6.5
  const zIndex = Math.round(30 - absDiff * 5)

  return {
    transform: `translate3d(calc(-50% + ${x.toFixed(1)}px), ${y.toFixed(1)}px, ${z.toFixed(1)}px) scale(${scale.toFixed(2)}) rotate(${rotateDeg.toFixed(1)}deg)`,
    filter: `blur(${blur.toFixed(1)}px)`,
    opacity: opacity.toFixed(2),
    zIndex,
    cursor: isCenter ? 'default' : 'pointer',
  }
}

// Touch swipe support
let touchStartX = 0
let touchEndX = 0

function handleTouchStart(e: TouchEvent) {
  stopAutoRotate()
  touchStartX = e.touches[0].clientX
}

function handleTouchMove(e: TouchEvent) {
  touchEndX = e.touches[0].clientX
}

function handleTouchEnd() {
  const swipeDistance = touchEndX - touchStartX
  if (Math.abs(swipeDistance) > 35) {
    if (swipeDistance > 0) prevBottle()
    else nextBottle()
  }
  startAutoRotate()
}

function startAutoRotate() {
  if (autoRotateTimer) clearInterval(autoRotateTimer)
  autoRotateTimer = setInterval(() => {
    if (isAutoRotating.value) nextBottle()
  }, 3800)
}

function stopAutoRotate() {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer)
    autoRotateTimer = null
  }
}

onMounted(() => {
  startAutoRotate()
})

onUnmounted(() => {
  stopAutoRotate()
})
</script>

<template>
  <div
    class="relative flex w-full flex-col items-center select-none"
    @mouseenter="isAutoRotating = false"
    @mouseleave="isAutoRotating = true"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Dynamic Ambient Glow behind the carousel (compact radius) -->
    <div
      class="pointer-events-none absolute left-1/2 top-28 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] transition-colors duration-700 ease-out sm:h-72 sm:w-72"
      :style="{ backgroundColor: activeBottle.glowColor || 'rgba(82, 150, 91, 0.4)' }"
    ></div>

    <!-- Pedestal Spotlight Floor -->
    <div
      class="pointer-events-none absolute bottom-24 left-1/2 h-8 w-48 -translate-x-1/2 rounded-full bg-black/45 blur-md"
    ></div>
    <div
      class="pointer-events-none absolute bottom-25 left-1/2 h-4 w-32 -translate-x-1/2 rounded-full border border-white/20 bg-white/10 blur-xs"
    ></div>

    <!-- 3D Arc Stage (Compact 250px-270px height: perfect viewport fit) -->
    <div
      class="relative mx-auto flex h-[240px] w-full max-w-[480px] items-end justify-center overflow-visible pb-2 sm:h-[260px] lg:h-[275px]"
      style="perspective: 1000px"
    >
      <div
        v-for="(bottle, index) in bottles"
        :key="bottle.id"
        class="absolute bottom-2 left-1/2 origin-bottom transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
        :style="getBottleTransform(index)"
        :title="`Select ${bottle.name}`"
        @click="selectBottle(index)"
      >
        <div class="relative flex flex-col items-center">
          <!-- Active Bottle Glow Accent Under Base -->
          <div
            v-if="index === activeIndex"
            class="absolute -bottom-2 h-6 w-20 rounded-full blur-md transition-all duration-500"
            :style="{ backgroundColor: bottle.glowColor || 'rgba(82, 150, 91, 0.4)' }"
          ></div>

          <!-- Product Bottle Image (Right-sized for zero scroll) -->
          <img
            :src="bottle.image"
            :alt="bottle.name"
            class="h-44 w-auto max-w-[105px] object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)] transition-all sm:h-52 sm:max-w-[125px] lg:h-56 lg:max-w-[135px]"
            loading="eager"
            draggable="false"
          />
        </div>
      </div>
    </div>

    <!-- Integrated Compact Bottle Information & Controls Card -->
    <div class="relative z-30 mt-1 w-full max-w-md px-2 text-center">
      <!-- Unboxed Metadata (Zero-pill discipline) -->
      <div
        class="flex items-center justify-center gap-2 text-xs font-medium text-[#c9e6c1] transition-all duration-300"
      >
        <span class="tracking-wider uppercase">{{ activeBottle.category }}</span>
        <span aria-hidden="true" class="text-white/40">·</span>
        <span>{{ activeBottle.abv }}</span>
        <span aria-hidden="true" class="text-white/40">·</span>
        <span>{{ activeBottle.volume }}</span>
      </div>

      <!-- Bottle Title -->
      <h3
        class="mt-1 font-serif text-xl font-semibold tracking-tight text-white transition-all duration-300 sm:text-2xl"
      >
        {{ activeBottle.name }}
      </h3>

      <!-- 1-line Tagline / Tasting Note -->
      <p
        class="mx-auto mt-1 line-clamp-1 max-w-sm text-xs leading-normal text-[#d8e7d4] transition-all duration-300 sm:text-xs"
      >
        {{ activeBottle.tagline || activeBottle.note }}
      </p>

      <!-- Compact Unified Interactive Control Bar -->
      <div class="mt-3 flex items-center justify-center gap-3">
        <!-- Prev Button -->
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-white/50 hover:bg-white/20 active:scale-95"
          aria-label="Previous bottle"
          @click="prevBottle"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Pagination Indicators -->
        <div
          class="flex items-center gap-1 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 backdrop-blur-md"
        >
          <button
            v-for="(bottle, idx) in bottles"
            :key="bottle.id"
            type="button"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="[
              idx === activeIndex
                ? 'w-4 bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]'
                : 'w-1.5 bg-white/35 hover:bg-white/60',
            ]"
            :aria-label="`Go to ${bottle.name}`"
            @click="selectBottle(idx)"
          />
        </div>

        <!-- Next Button -->
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-white/50 hover:bg-white/20 active:scale-95"
          aria-label="Next bottle"
          @click="nextBottle"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Quick Order CTA -->
        <NuxtLink
          :to="`/order?product=${encodeURIComponent(activeBottle.name)}`"
          class="inline-flex items-center gap-1 rounded-full bg-[#c6dfbc] px-3.5 py-1.5 text-xs font-semibold text-[#173b2b] shadow-sm transition-all hover:bg-white hover:shadow-md"
        >
          <span>Order</span>
          <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
