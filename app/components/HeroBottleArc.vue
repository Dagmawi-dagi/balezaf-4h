<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

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

export interface BottleItem {
  id: string
  name: string
  category: string
  volume: string
  abv: string
  tagline: string
  image: string
  color: string
  glowColor: string
}

const bottles: BottleItem[] = [
  {
    id: 'gin',
    name: 'Desta Dry Gin',
    category: 'London Dry Gin',
    volume: '750ml',
    abv: '40% Vol.',
    tagline: 'Highland juniper botanicals with crisp citrus peel and angelica root.',
    image: ginImg,
    color: '#52965b',
    glowColor: 'rgba(82, 150, 91, 0.4)',
  },
  {
    id: 'vodka',
    name: 'Desta Premium Vodka',
    category: 'Triple-Filtered Vodka',
    volume: '750ml',
    abv: '40% Vol.',
    tagline: 'Pure mountain spring water and selected grains for velvety smoothness.',
    image: vodkaImg,
    color: '#428ea4',
    glowColor: 'rgba(66, 142, 164, 0.4)',
  },
  {
    id: 'uozo',
    name: 'Desta Ouzo',
    category: 'Traditional Anise Spirit',
    volume: '750ml',
    abv: '41% Vol.',
    tagline: 'Aromatic star anise and fennel seeds with a classic louche bloom.',
    image: uozoImg,
    color: '#2d6d93',
    glowColor: 'rgba(45, 109, 147, 0.4)',
  },
  {
    id: 'zebib',
    name: 'Desta Zebib',
    category: 'Heritage Dry Anise',
    volume: '750ml',
    abv: '43% Vol.',
    tagline: 'Ethiopia’s iconic celebratory aperitif distilled with sun-cured grape spirit.',
    image: zebibImg,
    color: '#c27d2c',
    glowColor: 'rgba(194, 125, 44, 0.4)',
  },
  {
    id: 'cognac',
    name: 'Desta Fine Brandy',
    category: 'Oak-Aged Brandy',
    volume: '750ml',
    abv: '40% Vol.',
    tagline: 'Patiently matured in French oak casks for deep dried fruit complexity.',
    image: cognacImg,
    color: '#aa4d28',
    glowColor: 'rgba(170, 77, 40, 0.4)',
  },
  {
    id: 'coffee',
    name: 'Desta Coffee Liqueur',
    category: 'Arabica Coffee Liqueur',
    volume: '750ml',
    abv: '24% Vol.',
    tagline: 'Highland roasted Arabica beans infused with artisanal raw cane syrup.',
    image: coffeeImg,
    color: '#633924',
    glowColor: 'rgba(99, 57, 36, 0.4)',
  },
  {
    id: 'ananas',
    name: 'Desta Ananas Liqueur',
    category: 'Tropical Pineapple',
    volume: '750ml',
    abv: '24% Vol.',
    tagline: 'Sun-drenched tropical pineapple spirit with vibrant natural sweetness.',
    image: ananasImg,
    color: '#c89617',
    glowColor: 'rgba(200, 150, 23, 0.4)',
  },
  {
    id: 'apple',
    name: 'Desta Apple Liqueur',
    category: 'Orchard Apple Liqueur',
    volume: '750ml',
    abv: '24% Vol.',
    tagline: 'Crisp highland orchard apples pressed for refreshing natural fruit zest.',
    image: appleImg,
    color: '#b6483b',
    glowColor: 'rgba(182, 72, 59, 0.4)',
  },
  {
    id: 'lime',
    name: 'Desta Lime Spirit',
    category: 'Highland Lime Spirit',
    volume: '750ml',
    abv: '28% Vol.',
    tagline: 'Zesty cold-pressed citrus oils with an invigorating aromatic finish.',
    image: limeImg,
    color: '#739f28',
    glowColor: 'rgba(115, 159, 40, 0.4)',
  },
  {
    id: 'aprative',
    name: 'Desta Aperitif',
    category: 'Botanical Aperitivo',
    volume: '750ml',
    abv: '20% Vol.',
    tagline: 'Gentle bittersweet gentian root, bitter orange, and highland herbs.',
    image: aprativeImg,
    color: '#b03535',
    glowColor: 'rgba(176, 53, 53, 0.4)',
  },
]

const activeIndex = ref(0)
const isAutoRotating = ref(true)
let autoRotateTimer: any = null

const activeBottle = computed(() => bottles[activeIndex.value])

function nextBottle() {
  activeIndex.value = (activeIndex.value + 1) % bottles.length
}

function prevBottle() {
  activeIndex.value = (activeIndex.value - 1 + bottles.length) % bottles.length
}

function selectBottle(index: number) {
  activeIndex.value = index
}

// Compact Arc geometric math for proportional viewport fit
function getBottleTransform(index: number) {
  const count = bottles.length
  let diff = (index - activeIndex.value) % count
  if (diff > count / 2) diff -= count
  if (diff < -count / 2) diff += count

  // Spacing angle along the circular arc
  const angle = diff * 0.48
  // Horizontal spread: comfortable 210px max offset so bottles don't clip container
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
      :style="{ backgroundColor: activeBottle.glowColor }"
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
            :style="{ backgroundColor: bottle.glowColor }"
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
        {{ activeBottle.tagline }}
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
