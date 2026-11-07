<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import ginImg from '~/assets/gin.png'
import zebibImg from '~/assets/zebib.png'
import vodkaImg from '~/assets/vodka.png'
import coffeeImg from '~/assets/coffee.png'
import uozoImg from '~/assets/uozo.png'
import aprativeImg from '~/assets/aprative.png'
import cognacImg from '~/assets/cognac.png'

interface ShowcaseBottle {
  id: string
  name: string
  category: string
  abv: string
  botanical: string
  image: string
  color: string
  accentBg: string
}

const bottles: ShowcaseBottle[] = [
  {
    id: 'gin',
    name: 'Desta Dry Gin',
    category: 'Botanical Gin',
    abv: '40% ABV',
    botanical: 'Kosoret & Highland Juniper',
    image: ginImg,
    color: '#346643',
    accentBg: 'from-[#346643]/30 to-transparent',
  },
  {
    id: 'zebib',
    name: 'Balezaf Zebib',
    category: 'Anise Spirit',
    abv: '43% ABV',
    botanical: 'Sweet Aniseed & Fennel',
    image: zebibImg,
    color: '#8e6b32',
    accentBg: 'from-[#8e6b32]/30 to-transparent',
  },
  {
    id: 'vodka',
    name: 'Desta Vodka',
    category: 'Pure Vodka',
    abv: '40% ABV',
    botanical: 'Volcanic Aquifer Water',
    image: vodkaImg,
    color: '#326079',
    accentBg: 'from-[#326079]/30 to-transparent',
  },
  {
    id: 'coffee',
    name: 'Coffee Liqueur',
    category: 'Artisanal Liqueur',
    abv: '24% ABV',
    botanical: 'Yirgacheffe Arabica Beans',
    image: coffeeImg,
    color: '#5e381f',
    accentBg: 'from-[#5e381f]/30 to-transparent',
  },
  {
    id: 'uozo',
    name: 'Desta Uozo',
    category: 'Classic Spirit',
    abv: '41% ABV',
    botanical: 'Mediterranean Anisette',
    image: uozoImg,
    color: '#285736',
    accentBg: 'from-[#285736]/30 to-transparent',
  },
  {
    id: 'aprative',
    name: 'Highland Aperitif',
    category: 'Herbal Aperitif',
    abv: '28% ABV',
    botanical: 'Bitter Gentian & Wild Orange',
    image: aprativeImg,
    color: '#943828',
    accentBg: 'from-[#943828]/30 to-transparent',
  },
  {
    id: 'cognac',
    name: 'Desta Brandy',
    category: 'Distilled Brandy',
    abv: '40% ABV',
    botanical: 'Oak Matured & Dried Fig',
    image: cognacImg,
    color: '#874c20',
    accentBg: 'from-[#874c20]/30 to-transparent',
  },
]

const containerRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const bottleRefs = ref<HTMLElement[]>([])
const labelRefs = ref<HTMLElement[]>([])
const scrollProgress = ref(0)
const isSpread = ref(false)

let triggerInstance: ScrollTrigger | null = null

function setBottleRef(el: any, index: number) {
  if (el) {
    bottleRefs.value[index] = el
  }
}

function setLabelRef(el: any, index: number) {
  if (el) {
    labelRefs.value[index] = el
  }
}

onMounted(() => {
  if (!import.meta.client) return

  gsap.registerPlugin(ScrollTrigger)

  const container = containerRef.value
  const bottleEls = bottleRefs.value
  const labelEls = labelRefs.value

  if (!container || bottleEls.length === 0) return

  const total = bottleEls.length
  const midIndex = Math.floor(total / 2) // index 3 is center (coffee liqueur)

  // Initial Clustered State
  // Bottles overlap in center with varying rotations (-18deg to +18deg)
  bottleEls.forEach((el, i) => {
    const diff = i - midIndex
    const clusterX = diff * 32 // tight overlap
    const clusterY = Math.abs(diff) * 12 // subtle curve
    const clusterRotate = diff * 7.5 // fan angle when clustered
    const clusterScale = 1 - Math.abs(diff) * 0.04
    const zIndex = 20 - Math.abs(diff)

    gsap.set(el, {
      x: clusterX,
      y: clusterY,
      rotation: clusterRotate,
      scale: clusterScale,
      zIndex: zIndex,
      transformOrigin: '50% 90%',
    })
  })

  // Labels start hidden and slightly translated downward
  if (labelEls.length) {
    gsap.set(labelEls, {
      opacity: 0,
      y: 20,
    })
  }

  // Master GSAP ScrollTrigger Timeline
  const isMobile = window.innerWidth < 640
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024
  const spacing = isMobile ? 50 : isTablet ? 105 : 155
  const finalScale = isMobile ? 0.72 : isTablet ? 0.88 : 1

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        scrollProgress.value = Math.round(self.progress * 100)
        isSpread.value = self.progress > 0.4
      },
    },
  })

  // Phase 1: Bottles un-cluster, spread out horizontally across screen, rotate upright
  bottleEls.forEach((el, i) => {
    const diff = i - midIndex
    const spreadX = diff * spacing
    const spreadY = 0 // align in a straight horizontal lineup
    const finalRotate = 0 // stand proud and upright

    tl.to(
      el,
      {
        x: spreadX,
        y: spreadY,
        rotation: finalRotate,
        scale: finalScale,
        duration: 1.2,
        ease: 'power2.inOut',
      },
      0
    )
  })

  // Phase 2: Fade in bottle metadata badges & botanical notes one by one
  if (labelEls.length) {
    tl.to(
      labelEls,
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power1.out',
      },
      0.65
    )
  }

  triggerInstance = tl.scrollTrigger || null
})

onUnmounted(() => {
  if (triggerInstance) {
    triggerInstance.kill()
    triggerInstance = null
  }
})
</script>

<template>
  <section
    ref="containerRef"
    class="relative min-h-screen overflow-hidden bg-[#102a1e] py-16 text-white flex flex-col justify-between selection:bg-[#c6dfbc] selection:text-[#173b2b]"
  >
    <!-- Background Ambient Glows -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(82,150,91,0.22),transparent_65%)]"></div>
    <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/50 to-transparent"></div>

    <!-- Header Section -->
    <div class="relative z-20 mx-auto max-w-4xl px-6 text-center">
      <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-xs">
        <span class="h-2 w-2 rounded-full bg-[#8ebb84] animate-pulse"></span>
        <span class="text-xs font-bold uppercase tracking-[0.25em] text-[#b8d7af]">
          Scroll-Driven Lineup · GSAP Engine
        </span>
      </div>

      <h2 class="mt-4 font-serif text-3xl font-semibold sm:text-5xl lg:text-6xl leading-tight">
        From a single droplet into a <em class="font-normal text-[#b8d7af]">symphony of craft.</em>
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#c6dfbc]">
        Scroll downward to reveal our spirits spreading from their central distillation core into individual botanical expressions.
      </p>

      <!-- Scroll indicator & progress counter -->
      <div class="mt-4 flex items-center justify-center gap-3 text-xs font-mono text-[#8ebb84]">
        <span>Scroll scrub: {{ scrollProgress }}%</span>
        <div class="h-1 w-24 overflow-hidden rounded-full bg-white/10">
          <div
            class="h-full bg-[#8ebb84] transition-all duration-150"
            :style="{ width: `${scrollProgress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Center Stage: Bottles Carousel / Spread Area -->
    <div
      ref="trackRef"
      class="relative z-10 my-auto flex h-[480px] sm:h-[540px] w-full items-center justify-center overflow-visible"
    >
      <!-- Horizontal Base Pedestal Light -->
      <div
        class="pointer-events-none absolute bottom-12 h-8 w-full max-w-5xl rounded-[100%] bg-radial from-[#52965b]/30 via-white/5 to-transparent blur-md transition-opacity duration-700"
        :class="isSpread ? 'opacity-100 scale-100' : 'opacity-40 scale-50'"
      ></div>

      <!-- Bottle Items -->
      <div
        v-for="(bottle, idx) in bottles"
        :key="bottle.id"
        :ref="(el) => setBottleRef(el, idx)"
        class="absolute flex flex-col items-center justify-end will-change-transform cursor-pointer group"
        style="bottom: 40px;"
      >
        <!-- Ambient Bottle Aura Glow -->
        <div
          class="pointer-events-none absolute -bottom-4 h-36 w-32 rounded-full bg-radial blur-xl transition-all duration-500 group-hover:scale-150"
          :class="bottle.accentBg"
        ></div>

        <!-- Bottle Image Container -->
        <div class="relative z-10 transition-transform duration-300 group-hover:-translate-y-3">
          <img
            :src="bottle.image"
            :alt="bottle.name"
            class="h-64 sm:h-76 md:h-84 w-auto max-w-[130px] sm:max-w-[155px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)]"
            loading="lazy"
          />
        </div>

        <!-- Reflection / Cast Shadow -->
        <div class="mt-2 h-4 w-20 rounded-full bg-black/60 blur-xs transition-all duration-300 group-hover:scale-125 group-hover:bg-black/40"></div>

        <!-- Bottle Reveal Label Card -->
        <div
          :ref="(el) => setLabelRef(el, idx)"
          class="pointer-events-auto mt-4 flex flex-col items-center text-center will-change-transform transition-colors"
        >
          <span class="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#b8d7af] border border-white/10 backdrop-blur-xs">
            {{ bottle.abv }}
          </span>
          <h3 class="mt-2 font-serif text-sm sm:text-base font-bold text-white whitespace-nowrap">
            {{ bottle.name }}
          </h3>
          <p class="text-[11px] text-[#9fc79c] whitespace-nowrap hidden sm:block">
            {{ bottle.botanical }}
          </p>
        </div>
      </div>
    </div>

    <!-- Bottom Footer Specs Strip -->
    <div class="relative z-20 mx-auto max-w-5xl px-6 text-center text-xs text-[#a2c29f]/80">
      <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-12 border-t border-white/10 pt-5">
        <div><strong class="text-white">7 Flagship Spirits</strong> on Display</div>
        <div><strong class="text-white">100% Ethiopian Terroir</strong> Sourcing</div>
        <div><strong class="text-white">Precision Fractional</strong> Distillation</div>
      </div>
    </div>
  </section>
</template>
