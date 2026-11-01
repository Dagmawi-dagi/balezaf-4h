<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useProducts } from '~/composables/useProducts'

const { products: bottles } = useProducts()

const activeIndex = ref(0)
const isAutoRotating = ref(true)
let autoRotateTimer: any = null
const screenWidth = ref(1024)

function updateScreenWidth() {
  if (typeof window !== 'undefined') {
    screenWidth.value = window.innerWidth
  }
}

const isMobile = computed(() => screenWidth.value < 640)
const isTablet = computed(() => screenWidth.value >= 640 && screenWidth.value < 1024)

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

// Responsive Arc geometric calculations for fluid carousel on all screens
function getBottleTransform(index: number) {
  const count = bottles.value.length || 10
  let diff = (index - activeIndex.value) % count
  if (diff > count / 2) diff -= count
  if (diff < -count / 2) diff += count

  const absDiff = Math.abs(diff)
  const isCenter = absDiff < 0.1

  // Dynamic spread and spacing based on screen size:
  // On mobile (< 640px), keep bottles close together (spreadX = 118px) so ALL bottles stay visible inside viewport!
  // On tablet: spreadX = 165px
  // On desktop: spreadX = 210px
  let spreadX = 210
  let angleStep = 0.48
  let dropY = 36
  let depthZ = 55

  if (isMobile.value) {
    spreadX = 118 // Tightly clustered on small screens
    angleStep = 0.38 // Closer angular spacing
    dropY = 22 // Shallower vertical curve
    depthZ = 35 // Softer depth step
  } else if (isTablet.value) {
    spreadX = 165
    angleStep = 0.44
    dropY = 30
    depthZ = 45
  }

  const angle = diff * angleStep
  const x = Math.sin(angle) * spreadX
  const y = (1 - Math.cos(angle)) * dropY
  const z = Math.cos(angle) * depthZ

  // Proportional scaling for mobile vs desktop
  let scale = 1.0
  if (isMobile.value) {
    scale = isCenter ? 1.15 : Math.max(0.68, 0.94 - absDiff * 0.12)
  } else {
    scale = isCenter ? 1.2 : Math.max(0.68, 0.98 - absDiff * 0.14)
  }

  // Soft blur so bottles remain recognizable even behind the active bottle
  const blur = isCenter ? 0 : Math.min(absDiff * (isMobile.value ? 1.4 : 2.2), isMobile.value ? 3.5 : 5.5)

  // Opacity: high enough on mobile so all bottles are clearly seen rotating together
  const opacity = isCenter ? 1 : Math.max(isMobile.value ? 0.45 : 0.26, 0.92 - absDiff * (isMobile.value ? 0.16 : 0.22))

  // Subtle tilt along the arc
  const rotateDeg = diff * (isMobile.value ? 5.5 : 6.5)
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
  if (Math.abs(swipeDistance) > 30) {
    if (swipeDistance > 0) prevBottle()
    else nextBottle()
  }
  startAutoRotate()
}

function startAutoRotate() {
  if (autoRotateTimer) clearInterval(autoRotateTimer)
  autoRotateTimer = setInterval(() => {
    if (isAutoRotating.value) nextBottle()
  }, 3600)
}

function stopAutoRotate() {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer)
    autoRotateTimer = null
  }
}

onMounted(() => {
  updateScreenWidth()
  window.addEventListener('resize', updateScreenWidth, { passive: true })
  startAutoRotate()
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateScreenWidth)
  }
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
    <!-- Dynamic Ambient Glow behind the carousel -->
    <div
      class="pointer-events-none absolute left-1/2 top-24 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px] transition-colors duration-700 ease-out sm:top-28 sm:h-64 sm:w-64"
      :style="{ backgroundColor: activeBottle.glowColor || 'rgba(82, 150, 91, 0.4)' }"
    ></div>

    <!-- Pedestal Spotlight Floor -->
    <div
      class="pointer-events-none absolute bottom-22 left-1/2 h-7 w-40 -translate-x-1/2 rounded-full bg-black/45 blur-md sm:bottom-24 sm:w-48"
    ></div>
    <div
      class="pointer-events-none absolute bottom-23 left-1/2 h-3.5 w-28 -translate-x-1/2 rounded-full border border-white/20 bg-white/10 blur-xs sm:bottom-25 sm:w-32"
    ></div>

    <!-- 3D Arc Stage (Compact & Responsive: bottles clustered together on mobile) -->
    <div
      class="relative mx-auto flex h-[210px] w-full max-w-[360px] items-end justify-center overflow-visible pb-2 sm:h-[245px] sm:max-w-[460px] lg:h-[265px] lg:max-w-[490px]"
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
            class="absolute -bottom-2 h-5 w-16 rounded-full blur-md transition-all duration-500 sm:w-20"
            :style="{ backgroundColor: bottle.glowColor || 'rgba(82, 150, 91, 0.4)' }"
          ></div>

          <!-- Product Bottle Image (Responsive heights: clearly visible in compact arc) -->
          <img
            :src="bottle.image"
            :alt="bottle.name"
            class="h-36 w-auto max-w-[90px] object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.5)] transition-all sm:h-48 sm:max-w-[115px] lg:h-54 lg:max-w-[130px]"
            loading="eager"
            draggable="false"
          />
        </div>
      </div>
    </div>

    <!-- Integrated Compact Bottle Information & Controls Card -->
    <div class="relative z-30 mt-1 w-full max-w-md px-2 text-center">
      <!-- Unboxed Metadata -->
      <div
        class="flex items-center justify-center gap-2 text-[11px] font-medium text-[#c9e6c1] transition-all duration-300 sm:text-xs"
      >
        <span class="tracking-wider uppercase">{{ activeBottle.category }}</span>
        <span aria-hidden="true" class="text-white/40">·</span>
        <span>{{ activeBottle.abv }}</span>
        <span aria-hidden="true" class="text-white/40">·</span>
        <span>{{ activeBottle.volume }}</span>
      </div>

      <!-- Bottle Title -->
      <h3
        class="mt-0.5 font-serif text-lg font-semibold tracking-tight text-white transition-all duration-300 sm:text-2xl"
      >
        {{ activeBottle.name }}
      </h3>

      <!-- 1-line Tagline / Tasting Note -->
      <p
        class="mx-auto mt-0.5 line-clamp-1 max-w-sm text-[11px] leading-normal text-[#d8e7d4] transition-all duration-300 sm:text-xs"
      >
        {{ activeBottle.tagline || activeBottle.note }}
      </p>

      <!-- Compact Unified Interactive Control Bar -->
      <div class="mt-2.5 flex items-center justify-center gap-2.5 sm:mt-3 sm:gap-3">
        <!-- Prev Button -->
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-white/50 hover:bg-white/20 active:scale-95 sm:h-8 sm:w-8"
          aria-label="Previous bottle"
          @click="prevBottle"
        >
          <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          class="flex items-center gap-1 rounded-full border border-white/15 bg-black/35 px-2 py-0.5 backdrop-blur-md sm:px-2.5 sm:py-1"
        >
          <button
            v-for="(bottle, idx) in bottles"
            :key="bottle.id"
            type="button"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="[
              idx === activeIndex
                ? 'w-3.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] sm:w-4'
                : 'w-1.5 bg-white/35 hover:bg-white/60',
            ]"
            :aria-label="`Go to ${bottle.name}`"
            @click="selectBottle(idx)"
          />
        </div>

        <!-- Next Button -->
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-white/50 hover:bg-white/20 active:scale-95 sm:h-8 sm:w-8"
          aria-label="Next bottle"
          @click="nextBottle"
        >
          <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          class="inline-flex items-center gap-1 rounded-full bg-[#c6dfbc] px-3 py-1 text-[11px] font-semibold text-[#173b2b] shadow-sm transition-all hover:bg-white hover:shadow-md sm:px-3.5 sm:py-1.5 sm:text-xs"
        >
          <span>Order</span>
          <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
