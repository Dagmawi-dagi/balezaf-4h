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
  notes: string
  image: string
  color: string
  glowColor: string
  accentBg: string
  badgeClass: string
}

const bottles: BottleItem[] = [
  {
    id: 'gin',
    name: 'Desta Dry Gin',
    category: 'Signature London Dry',
    volume: '750ml',
    abv: '40% Vol.',
    tagline: 'Bright juniper botanicals with crisp highland citrus and angelica root.',
    notes: 'Aromatic juniper, coriander seed, citrus peel, clean dry finish.',
    image: ginImg,
    color: '#52965b',
    glowColor: 'rgba(82, 150, 91, 0.45)',
    accentBg: 'bg-[#52965b]',
    badgeClass: 'bg-[#e7f4e9] text-[#1f5a2b] border-[#a8d6b0]',
  },
  {
    id: 'vodka',
    name: 'Desta Premium Vodka',
    category: 'Triple-Filtered Vodka',
    volume: '750ml',
    abv: '40% Vol.',
    tagline: 'Pure mountain water and selected grain filtered for velvety smoothness.',
    notes: 'Neutral silky mouthfeel, subtle sweet grain finish, exceptionally crisp.',
    image: vodkaImg,
    color: '#428ea4',
    glowColor: 'rgba(66, 142, 164, 0.45)',
    accentBg: 'bg-[#428ea4]',
    badgeClass: 'bg-[#e5f4f8] text-[#13495b] border-[#9ed1de]',
  },
  {
    id: 'uozo',
    name: 'Desta Ouzo',
    category: 'Traditional Anise Spirit',
    volume: '750ml',
    abv: '41% Vol.',
    tagline: 'Authentic Mediterranean-style anise spirit with a luminous cloudy bloom.',
    notes: 'Sweet star anise, fennel seeds, refreshing herbal warmth on the palate.',
    image: uozoImg,
    color: '#2d6d93',
    glowColor: 'rgba(45, 109, 147, 0.45)',
    accentBg: 'bg-[#2d6d93]',
    badgeClass: 'bg-[#e7f1f8] text-[#154661] border-[#9dc3db]',
  },
  {
    id: 'zebib',
    name: 'Desta Zebib',
    category: 'Heritage Dry Anise',
    volume: '750ml',
    abv: '43% Vol.',
    tagline: 'Ethiopia’s iconic aperitif distilled with sun-cured grape alcohol and botanicals.',
    notes: 'Bold aniseed punch, spiced herbal undertones, warm celebratory finish.',
    image: zebibImg,
    color: '#c27d2c',
    glowColor: 'rgba(194, 125, 44, 0.45)',
    accentBg: 'bg-[#c27d2c]',
    badgeClass: 'bg-[#faf0df] text-[#6d4111] border-[#e4bf8b]',
  },
  {
    id: 'cognac',
    name: 'Desta Fine Brandy',
    category: 'Oak-Aged Brandy',
    volume: '750ml',
    abv: '40% Vol.',
    tagline: 'Patiently matured in toasted oak casks for deep amber complexity.',
    notes: 'Toasted vanilla, dried fig, warm honeyed oak, long gentle finish.',
    image: cognacImg,
    color: '#aa4d28',
    glowColor: 'rgba(170, 77, 40, 0.45)',
    accentBg: 'bg-[#aa4d28]',
    badgeClass: 'bg-[#faece6] text-[#71280d] border-[#e2a890]',
  },
  {
    id: 'coffee',
    name: 'Desta Coffee Liqueur',
    category: 'Arabica Coffee Liqueur',
    volume: '750ml',
    abv: '24% Vol.',
    tagline: 'Infused with roasted Ethiopian highland Arabica beans and raw cane syrup.',
    notes: 'Rich dark espresso roast, artisanal dark chocolate, smooth sweet crema.',
    image: coffeeImg,
    color: '#633924',
    glowColor: 'rgba(99, 57, 36, 0.45)',
    accentBg: 'bg-[#633924]',
    badgeClass: 'bg-[#f6eee9] text-[#4d2512] border-[#cbb0a1]',
  },
  {
    id: 'ananas',
    name: 'Desta Ananas Liqueur',
    category: 'Tropical Pineapple Liqueur',
    volume: '750ml',
    abv: '24% Vol.',
    tagline: 'Sun-ripened tropical pineapple infused for natural golden sweetness.',
    notes: 'Luscious juicy pineapple, delicate citrus acidity, vibrant tropical aroma.',
    image: ananasImg,
    color: '#c89617',
    glowColor: 'rgba(200, 150, 23, 0.45)',
    accentBg: 'bg-[#c89617]',
    badgeClass: 'bg-[#faf5de] text-[#694806] border-[#dec379]',
  },
  {
    id: 'apple',
    name: 'Desta Apple Liqueur',
    category: 'Orchard Apple Liqueur',
    volume: '750ml',
    abv: '24% Vol.',
    tagline: 'Crisp highland orchard apples pressed and steeped for refreshing natural zest.',
    notes: 'Tart green apple crispness, spiced honey undertones, smooth orchard finish.',
    image: appleImg,
    color: '#b6483b',
    glowColor: 'rgba(182, 72, 59, 0.45)',
    accentBg: 'bg-[#b6483b]',
    badgeClass: 'bg-[#fbecea] text-[#6b1e16] border-[#df9b94]',
  },
  {
    id: 'lime',
    name: 'Desta Lime Spirit',
    category: 'Highland Lime Spirit',
    volume: '750ml',
    abv: '28% Vol.',
    tagline: 'Zesty cold-pressed citrus oils with an invigorating, bright aroma.',
    notes: 'Bright lime zest, lemongrass aroma, refreshing clean citrus punch.',
    image: limeImg,
    color: '#739f28',
    glowColor: 'rgba(115, 159, 40, 0.45)',
    accentBg: 'bg-[#739f28]',
    badgeClass: 'bg-[#f3f9e7] text-[#36510d] border-[#b5d583]',
  },
  {
    id: 'aprative',
    name: 'Desta Aperitif',
    category: 'Botanical Aperitivo',
    volume: '750ml',
    abv: '20% Vol.',
    tagline: 'A harmonious blend of gentian root, bitter orange, and alpine herbs.',
    notes: 'Gentle bittersweet citrus, herbal botanicals, balanced sparkling finish.',
    image: aprativeImg,
    color: '#b03535',
    glowColor: 'rgba(176, 53, 53, 0.45)',
    accentBg: 'bg-[#b03535]',
    badgeClass: 'bg-[#faebeb] text-[#6a1515] border-[#df9494]',
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

// Arc geometric calculations for circular 3D trajectory
function getBottleTransform(index: number) {
  const count = bottles.length
  let diff = (index - activeIndex.value) % count
  if (diff > count / 2) diff -= count
  if (diff < -count / 2) diff += count

  // Calculate arc coordinates
  // Horizontal spread across an elliptical arc
  const angle = diff * 0.44 // Radians spacing
  const x = Math.sin(angle) * 310
  const y = (1 - Math.cos(angle)) * 68 // Drops along the arc as it recedes
  const z = Math.cos(angle) * 100 // Forward/backward depth

  const absDiff = Math.abs(diff)
  const isCenter = absDiff < 0.1

  // Scale: active bottle is prominent (1.3x), receding bottles shrink to 0.65x
  const scale = isCenter ? 1.32 : Math.max(0.64, 1.05 - absDiff * 0.18)

  // Blur: active bottle is crystal clear (0px), side bottles progressively blur
  const blur = isCenter ? 0 : Math.min(absDiff * 2.8, 8)

  // Opacity: center is 1, sides fade smoothly
  const opacity = isCenter ? 1 : Math.max(0.28, 1 - absDiff * 0.24)

  // Rotation tilt following the arc angle
  const rotateDeg = diff * 8

  // Z-index layering
  const zIndex = Math.round(40 - absDiff * 6)

  return {
    transform: `translate3d(calc(-50% + ${x.toFixed(1)}px), ${y.toFixed(1)}px, ${z.toFixed(1)}px) scale(${scale.toFixed(2)}) rotate(${rotateDeg.toFixed(1)}deg)`,
    filter: `blur(${blur.toFixed(1)}px)`,
    opacity: opacity.toFixed(2),
    zIndex,
    cursor: isCenter ? 'default' : 'pointer',
  }
}

// Touch and drag swipe handling
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
  if (Math.abs(swipeDistance) > 40) {
    if (swipeDistance > 0) {
      prevBottle()
    } else {
      nextBottle()
    }
  }
  startAutoRotate()
}

function startAutoRotate() {
  if (autoRotateTimer) clearInterval(autoRotateTimer)
  autoRotateTimer = setInterval(() => {
    if (isAutoRotating.value) {
      nextBottle()
    }
  }, 3600)
}

function stopAutoRotate() {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer)
    autoRotateTimer = null
  }
}

function pauseRotation() {
  isAutoRotating.value = false
}

function resumeRotation() {
  isAutoRotating.value = true
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
    class="relative w-full select-none"
    @mouseenter="pauseRotation"
    @mouseleave="resumeRotation"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Background dynamic ambient glow radiating signature product color -->
    <div
      class="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] transition-colors duration-700 ease-out sm:h-[480px] sm:w-[480px]"
      :style="{ backgroundColor: activeBottle.glowColor }"
    ></div>

    <!-- Spotlight Pedestal Shadow -->
    <div
      class="pointer-events-none absolute bottom-12 left-1/2 h-14 w-64 -translate-x-1/2 rounded-full bg-black/40 blur-xl transition-all duration-500"
    ></div>
    <div
      class="pointer-events-none absolute bottom-16 left-1/2 h-8 w-44 -translate-x-1/2 rounded-full border border-white/20 bg-white/10 blur-sm"
    ></div>

    <!-- 3D Arc / Circular Orbit Stage -->
    <div
      class="relative mx-auto flex h-[410px] w-full max-w-[580px] items-end justify-center overflow-visible pb-12 sm:h-[460px] lg:h-[490px]"
      style="perspective: 1200px"
    >
      <div
        v-for="(bottle, index) in bottles"
        :key="bottle.id"
        class="absolute bottom-14 left-1/2 origin-bottom transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
        :style="getBottleTransform(index)"
        :title="`Select ${bottle.name}`"
        @click="selectBottle(index)"
      >
        <div class="relative flex flex-col items-center">
          <!-- Active bottle pedestal glow ring -->
          <div
            v-if="index === activeIndex"
            class="absolute -bottom-3 h-10 w-28 rounded-full blur-md transition-all duration-500"
            :style="{ backgroundColor: bottle.glowColor }"
          ></div>

          <!-- Bottle Image -->
          <img
            :src="bottle.image"
            :alt="bottle.name"
            class="h-64 w-auto max-w-[135px] object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.55)] transition-transform sm:h-76 sm:max-w-[160px] lg:h-84 lg:max-w-[175px]"
            loading="eager"
            draggable="false"
          />

          <!-- Quick tag on active center bottle -->
          <div
            v-if="index === activeIndex"
            class="mt-2 hidden whitespace-nowrap rounded-full border border-white/25 bg-black/60 px-3 py-0.5 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md sm:block"
          >
            {{ bottle.abv }} · {{ bottle.volume }}
          </div>
        </div>
      </div>
    </div>

    <!-- Active Bottle Information Banner & Controls -->
    <div class="relative z-40 mx-auto mt-2 max-w-xl text-center">
      <!-- Animated category & name badge -->
      <div class="flex items-center justify-center gap-2">
        <span
          class="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-300"
          :class="activeBottle.badgeClass"
        >
          {{ activeBottle.category }}
        </span>
        <span
          class="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-[#c9e6c1] backdrop-blur-sm"
        >
          {{ activeBottle.abv }}
        </span>
      </div>

      <h3
        class="mt-3 font-serif text-2xl font-semibold tracking-tight text-white transition-all duration-300 sm:text-3xl"
      >
        {{ activeBottle.name }}
      </h3>

      <p
        class="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#d8e7d4] transition-all duration-300 sm:text-sm"
      >
        {{ activeBottle.tagline }}
      </p>

      <!-- Carousel Navigation Controls -->
      <div class="mt-5 flex items-center justify-center gap-4">
        <!-- Previous Button -->
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-white/50 hover:bg-white/20 active:scale-95"
          aria-label="Previous bottle"
          @click="prevBottle"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Pagination Pill Indicators with Bottle Initial / Tooltip -->
        <div
          class="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 backdrop-blur-md"
        >
          <button
            v-for="(bottle, idx) in bottles"
            :key="bottle.id"
            type="button"
            class="h-2.5 rounded-full transition-all duration-300"
            :class="[
              idx === activeIndex
                ? 'w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                : 'w-2 bg-white/40 hover:bg-white/70',
            ]"
            :aria-label="`Go to ${bottle.name}`"
            @click="selectBottle(idx)"
          />
        </div>

        <!-- Next Button -->
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-white/50 hover:bg-white/20 active:scale-95"
          aria-label="Next bottle"
          @click="nextBottle"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <!-- Quick Action CTAs for the Active Product -->
      <div class="mt-4 flex items-center justify-center gap-3">
        <NuxtLink
          :to="`/order?product=${encodeURIComponent(activeBottle.name)}`"
          class="inline-flex items-center gap-1.5 rounded-full bg-[#c6dfbc] px-5 py-2 text-xs font-semibold text-[#173b2b] shadow-md transition-all hover:bg-white hover:shadow-lg"
        >
          <span>Order {{ activeBottle.name.split(' ').slice(-1)[0] }}</span>
          <span aria-hidden="true">↗</span>
        </NuxtLink>

        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
        >
          <span>All 10 Bottles</span>
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
