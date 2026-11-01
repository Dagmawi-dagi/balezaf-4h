<script setup lang="ts">
import { ref } from 'vue'
import ProductDetailModal, { type ProductDetail } from '~/components/ProductDetailModal.vue'

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

const products: (ProductDetail & { type: string })[] = [
  {
    name: 'Desta Dry Gin',
    type: 'London Dry Gin',
    category: 'London Dry Gin',
    abv: '40% Vol.',
    volume: '750ml',
    note: 'Juniper-led botanical spirit with bright highland citrus, wild herbs, and angelica root.',
    image: ginImg,
    badge: 'bg-[#e7f4e9] text-[#1f5a2b]',
    color: '#52965b',
    glowColor: 'rgba(82, 150, 91, 0.45)',
    aroma: 'Wild highland juniper, fresh lime peel, crushed coriander, aromatic angelica.',
    palate: 'Zesty citrus entry, herbal pine richness, and delicate botanical warmth.',
    finish: 'Crisp, lingering dry finish with subtle lime and cardamom blossoms.',
    serving: 'Serve over clear ice with premium tonic water and fresh mint or lime wheel.',
  },
  {
    name: 'Desta Premium Vodka',
    type: 'Triple-Filtered Vodka',
    category: 'Triple-Filtered Vodka',
    abv: '40% Vol.',
    volume: '750ml',
    note: 'Clean, exceptionally smooth grain spirit distilled with mountain spring water for a silky finish.',
    image: vodkaImg,
    badge: 'bg-[#e5f4f8] text-[#13495b]',
    color: '#428ea4',
    glowColor: 'rgba(66, 142, 164, 0.45)',
    aroma: 'Neutral mineral crispness, light toasted grain, pure spring water purity.',
    palate: 'Ultra-silky and velvety mouthfeel with a gentle sweetness of wheat and rye.',
    finish: 'Exceptionally smooth with clean warmth and zero harsh edge.',
    serving: 'Best ice-cold from the freezer, shaken into a classic Martini or fresh juice cocktail.',
  },
  {
    name: 'Desta Ouzo',
    type: 'Traditional Anise Spirit',
    category: 'Traditional Anise Spirit',
    abv: '41% Vol.',
    volume: '750ml',
    note: 'Classic Mediterranean-style star anise spirit with an authentic milky louche bloom.',
    image: uozoImg,
    badge: 'bg-[#e7f1f8] text-[#154661]',
    color: '#2d6d93',
    glowColor: 'rgba(45, 109, 147, 0.45)',
    aroma: 'Pungent aromatic star anise, sweet fennel, subtle licorice root.',
    palate: 'Intensely aromatic, velvety aniseed richness with a natural cooling sensation.',
    finish: 'Long, warming, licorice finish that louches into a milky white cloud when water is added.',
    serving: 'Traditional mezze style: poured over 2 ice cubes with a splash of cold mountain water.',
  },
  {
    name: 'Desta Zebib',
    type: 'Heritage Dry Anise',
    category: 'Heritage Dry Anise',
    abv: '43% Vol.',
    volume: '750ml',
    note: 'Ethiopia’s signature celebratory spirit crafted from distilled grape alcohol and aniseed.',
    image: zebibImg,
    badge: 'bg-[#faf0df] text-[#6d4111]',
    color: '#c27d2c',
    glowColor: 'rgba(194, 125, 44, 0.45)',
    aroma: 'Sun-cured grape wine distillates, potent star anise, warm herbal bouquet.',
    palate: 'Full-bodied spiced aniseed warmth with rich botanical depth.',
    finish: 'Long, aromatic licorice finish traditionally enjoyed during holidays and toasts.',
    serving: 'Enjoy neat alongside Ethiopian festive dining or poured over ice cubes with water.',
  },
  {
    name: 'Desta Fine Brandy',
    type: 'Oak-Aged Brandy / Cognac',
    category: 'Oak-Aged Brandy',
    abv: '40% Vol.',
    volume: '750ml',
    note: 'Patiently matured in French oak casks with rich dried fruit, vanilla, and spice notes.',
    image: cognacImg,
    badge: 'bg-[#faece6] text-[#71280d]',
    color: '#aa4d28',
    glowColor: 'rgba(170, 77, 40, 0.45)',
    aroma: 'Warm toasted oak, dried figs, golden raisins, dark caramel, vanilla bean.',
    palate: 'Rich honeyed texture, stewed stone fruits, cinnamon spice, and nutty tannins.',
    finish: 'Mellow, lingering warmth with notes of toasted brioche and dark cocoa.',
    serving: 'In a warm snifter glass, sipped slowly after dinner or with espresso.',
  },
  {
    name: 'Desta Coffee Liqueur',
    type: 'Arabica Coffee Liqueur',
    category: 'Arabica Coffee Liqueur',
    abv: '24% Vol.',
    volume: '750ml',
    note: 'Single-origin roasted Ethiopian highland Arabica beans infused with raw cane syrup.',
    image: coffeeImg,
    badge: 'bg-[#f6eee9] text-[#4d2512]',
    color: '#633924',
    glowColor: 'rgba(99, 57, 36, 0.45)',
    aroma: 'Freshly roasted Ethiopian highland Arabica beans, dark cocoa nibs, brown sugar.',
    palate: 'Rich espresso crema, velvety Madagascar vanilla, dark chocolate syrup.',
    finish: 'Sweet, balanced, robust roasted coffee finish without cloying heaviness.',
    serving: 'Chilled over ice, poured over vanilla ice cream (Affogato), or in an Espresso Martini.',
  },
  {
    name: 'Desta Ananas Liqueur',
    type: 'Tropical Pineapple Liqueur',
    category: 'Tropical Pineapple Liqueur',
    abv: '24% Vol.',
    volume: '750ml',
    note: 'Sun-drenched tropical pineapple spirit with vibrant natural sweetness and fruit aroma.',
    image: ananasImg,
    badge: 'bg-[#faf5de] text-[#694806]',
    color: '#c89617',
    glowColor: 'rgba(200, 150, 23, 0.45)',
    aroma: 'Ripe tropical pineapple, candied citrus zest, honeyed golden fruit.',
    palate: 'Juicy, sweet and tangy pineapple pulp with crisp citrus balance.',
    finish: 'Refreshing, vibrant tropical sweetness that lingers clean.',
    serving: 'Shaken over crushed ice with soda water, or blended into tropical spritzes.',
  },
  {
    name: 'Desta Apple Liqueur',
    type: 'Orchard Apple Liqueur',
    category: 'Orchard Apple Liqueur',
    abv: '24% Vol.',
    volume: '750ml',
    note: 'Crisp highland apples pressed and steeped for refreshing natural fruit zest.',
    image: appleImg,
    badge: 'bg-[#fbecea] text-[#6b1e16]',
    color: '#b6483b',
    glowColor: 'rgba(182, 72, 59, 0.45)',
    aroma: 'Freshly picked crisp green apples, apple blossom, spiced cider nectar.',
    palate: 'Crisp acidity upfront, sweet golden delicious apple nectar, delicate honey.',
    finish: 'Tart and refreshing apple peel finish with sparkling clarity.',
    serving: 'Served chilled with sparkling cider or dry prosecco as an aperitif.',
  },
  {
    name: 'Desta Lime Spirit',
    type: 'Highland Lime Spirit',
    category: 'Highland Lime Spirit',
    abv: '28% Vol.',
    volume: '750ml',
    note: 'Zesty cold-pressed citrus oils and refreshing lemongrass aroma on a crisp palate.',
    image: limeImg,
    badge: 'bg-[#f3f9e7] text-[#36510d]',
    color: '#739f28',
    glowColor: 'rgba(115, 159, 40, 0.45)',
    aroma: 'Cold-pressed key lime zest, aromatic kaffir lime leaf, lemongrass.',
    palate: 'Crisp, mouth-watering lime acidity balanced with sweet spirit warmth.',
    finish: 'Invigorating, zesty, clean citrus finish.',
    serving: 'Poured over crushed ice with ginger ale, or as a vibrant margarita twist.',
  },
  {
    name: 'Desta Aperitif',
    type: 'Botanical Bitter-Sweet',
    category: 'Botanical Bitter-Sweet',
    abv: '20% Vol.',
    volume: '750ml',
    note: 'Harmonious blend of gentian root, bitter orange peel, and highland botanicals.',
    image: aprativeImg,
    badge: 'bg-[#faebeb] text-[#6a1515]',
    color: '#b03535',
    glowColor: 'rgba(176, 53, 53, 0.45)',
    aroma: 'Bitter orange peel, gentian root, alpine botanicals, wild rhubarb.',
    palate: 'Initial sweet citrus entry transitioning into a balanced, complex botanical bitterness.',
    finish: 'Crisp, stimulating digestive finish that prepares the palate for dining.',
    serving: 'Built in a wine glass with ice, 3 parts club soda, and an orange wheel.',
  },
]

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
