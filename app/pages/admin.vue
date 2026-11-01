<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { type ProductItem, resolveBottleImage, useProducts } from '~/composables/useProducts'

const {
  products,
  topProducts,
  updateProduct,
  addProduct,
  deleteProduct,
  resetToDefaults,
  downloadJsonFile,
  importJsonString,
  availableImageKeys,
} = useProducts()

const activeTab = ref('Products')
const tabs = ['Products', 'Overview', 'Events', 'Blog posts', 'Job vacancies']
const toastMessage = ref('')
const showToast = ref(false)

function notify(msg: string) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Product editing state
const editingProduct = ref<ProductItem | null>(null)
const isEditModalOpen = ref(false)
const isNewProduct = ref(false)

const productForm = reactive<ProductItem>({
  id: '',
  name: '',
  category: '',
  volume: '750ml',
  abv: '40% Vol.',
  tagline: '',
  note: '',
  imageKey: 'gin',
  color: '#52965b',
  glowColor: 'rgba(82, 150, 91, 0.45)',
  aroma: '',
  palate: '',
  finish: '',
  serving: '',
  isTopFlagship: false,
})

function openEditModal(prod: any) {
  isNewProduct.value = false
  editingProduct.value = prod
  Object.assign(productForm, {
    id: prod.id,
    name: prod.name,
    category: prod.category,
    volume: prod.volume || '750ml',
    abv: prod.abv || '40% Vol.',
    tagline: prod.tagline || '',
    note: prod.note || '',
    imageKey: prod.imageKey || 'gin',
    color: prod.color || '#52965b',
    glowColor: prod.glowColor || 'rgba(82, 150, 91, 0.45)',
    aroma: prod.aroma || '',
    palate: prod.palate || '',
    finish: prod.finish || '',
    serving: prod.serving || '',
    isTopFlagship: !!prod.isTopFlagship,
  })
  isEditModalOpen.value = true
}

function openAddModal() {
  isNewProduct.value = true
  editingProduct.value = null
  const newId = 'product_' + Date.now().toString(36)
  Object.assign(productForm, {
    id: newId,
    name: 'New Ethiopian Spirit',
    category: 'Craft Spirit',
    volume: '750ml',
    abv: '40% Vol.',
    tagline: 'Handcrafted with traditional botanicals and mountain spring water.',
    note: 'Smooth character with distinctive aromatic notes and a warming finish.',
    imageKey: 'gin',
    color: '#52965b',
    glowColor: 'rgba(82, 150, 91, 0.45)',
    aroma: 'Fresh citrus, herbal botanicals, and warm spice.',
    palate: 'Silky texture with balanced sweetness and natural warmth.',
    finish: 'Crisp, lingering aromatic finish.',
    serving: 'Serve chilled or on the rocks.',
    isTopFlagship: false,
  })
  isEditModalOpen.value = true
}

function saveProductChanges() {
  if (isNewProduct.value) {
    addProduct({ ...productForm })
    notify(`Created product "${productForm.name}" successfully!`)
  } else if (editingProduct.value) {
    updateProduct(editingProduct.value.id, { ...productForm })
    notify(`Saved changes for "${productForm.name}"!`)
  }
  isEditModalOpen.value = false
}

function removeProduct(id: string, name: string) {
  if (confirm(`Are you sure you want to delete "${name}" from the catalogue?`)) {
    deleteProduct(id)
    notify(`Deleted product "${name}".`)
  }
}

function toggleFlagship(prod: any) {
  const currentFlagships = products.value.filter((p) => p.isTopFlagship)
  if (!prod.isTopFlagship && currentFlagships.length >= 3) {
    notify('Home page already has 3 flagships. Please untoggle one first.')
    return
  }
  updateProduct(prod.id, { isTopFlagship: !prod.isTopFlagship })
  notify(
    !prod.isTopFlagship
      ? `"${prod.name}" is now featured on the Home Page!`
      : `Removed "${prod.name}" from Home Page top 3.`
  )
}

// JSON Import handling
const showImportModal = ref(false)
const importJsonText = ref('')

function handleImport() {
  if (!importJsonText.value.trim()) return
  const success = importJsonString(importJsonText.value.trim())
  if (success) {
    notify('Successfully imported product catalogue from JSON!')
    showImportModal.value = false
    importJsonText.value = ''
  } else {
    alert('Invalid JSON format. Please ensure it is a valid array of products.')
  }
}

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (content) {
      const success = importJsonString(content)
      if (success) {
        notify('Successfully imported JSON file!')
      } else {
        alert('Invalid JSON file format.')
      }
    }
  }
  reader.readAsText(file)
}

function handleResetDefaults() {
  if (confirm('Reset catalogue back to factory defaults from products.json? Any custom edits will be reverted.')) {
    resetToDefaults()
    notify('Reset to default products catalogue.')
  }
}

const stats = [
  { label: 'Total Products in JSON', value: computed(() => products.value.length.toString()) },
  { label: 'Featured on Home', value: computed(() => topProducts.value.length.toString()) },
  { label: 'Distillery Plant', value: 'Addis Ababa' },
]

useSeoMeta({
  title: 'Content Admin | Balezaf Spirits',
  description: 'Manage product catalogue, tasting notes, and website content.',
})
</script>

<template>
  <div class="min-h-screen bg-[#f3f7ef] text-[#173b2b]">
    <!-- Toast notification -->
    <div
      v-if="showToast"
      class="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-2xl border border-[#b8d7af] bg-[#173b2b] px-5 py-3.5 text-sm font-medium text-white shadow-2xl transition-all"
    >
      <span class="text-[#c6dfbc]">✓</span>
      <span>{{ toastMessage }}</span>
    </div>

    <div class="flex min-h-screen">
      <!-- Admin Sidebar -->
      <aside class="hidden w-64 shrink-0 bg-[#173b2b] p-7 text-white lg:block">
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#c6dfbc] font-serif font-bold text-[#173b2b]">
            B
          </div>
          <div>
            <span class="block text-sm font-semibold tracking-wider">BALEZAF</span>
            <span class="block text-[10px] text-[#9fc495]">Content Studio</span>
          </div>
        </NuxtLink>

        <nav class="mt-10 space-y-1.5">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition"
            :class="activeTab === tab ? 'bg-[#35653c] text-white shadow-sm' : 'text-[#c8ddc4] hover:bg-white/10'"
            @click="activeTab = tab"
          >
            <span>{{ tab }}</span>
            <span
              v-if="tab === 'Products'"
              class="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white"
            >
              {{ products.length }}
            </span>
          </button>
        </nav>

        <div class="mt-12 border-t border-white/15 pt-6">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-xs font-medium text-[#b8d7af] transition hover:text-white">
            <span>← Return to website</span>
          </NuxtLink>
        </div>
      </aside>

      <!-- Main Workspace -->
      <main class="flex-1">
        <!-- Top App Bar -->
        <header class="flex items-center justify-between border-b border-[#dfe9da] bg-white px-6 py-4 lg:px-10">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#65975d]">Content Management System</p>
            <h1 class="mt-0.5 font-serif text-2xl font-semibold sm:text-3xl">{{ activeTab }}</h1>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink
              to="/"
              class="rounded-full border border-[#dce8d7] px-4 py-1.5 text-xs font-semibold text-[#173b2b] transition hover:bg-[#edf5e9]"
            >
              Preview Live Site ↗
            </NuxtLink>
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#c6dfbc] text-xs font-bold text-[#173b2b]">
              Admin
            </div>
          </div>
        </header>

        <!-- Tab Content -->
        <section class="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-10">
          <!-- PRODUCTS CMS TAB -->
          <div v-if="activeTab === 'Products'">
            <!-- Controls Bar: Add, Export JSON, Import JSON, Reset -->
            <div class="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-sm">
              <div>
                <h2 class="font-serif text-2xl font-semibold">Products Catalogue (JSON)</h2>
                <p class="mt-1 text-xs text-[#66816b]">
                  Edit product details, tasting notes, and toggle the 3 home page flagships. Non-dev friendly — updates take effect live!
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2.5">
                <!-- Export products.json Button -->
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full border border-[#b8cdb6] bg-white px-4 py-2 text-xs font-semibold text-[#2b5837] shadow-xs transition hover:bg-[#edf5e9]"
                  title="Download products.json to computer"
                  @click="downloadJsonFile"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export products.json</span>
                </button>

                <!-- Import JSON button -->
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full border border-[#b8cdb6] bg-white px-4 py-2 text-xs font-semibold text-[#2b5837] shadow-xs transition hover:bg-[#edf5e9]"
                  @click="showImportModal = true"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Import JSON</span>
                </button>

                <!-- Reset Defaults -->
                <button
                  type="button"
                  class="rounded-full border border-gray-200 px-3.5 py-2 text-xs text-gray-500 transition hover:bg-gray-100"
                  @click="handleResetDefaults"
                >
                  Reset Factory
                </button>

                <!-- Add New Product -->
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full bg-[#173b2b] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#35653c]"
                  @click="openAddModal"
                >
                  <span>+ Add Product</span>
                </button>
              </div>
            </div>

            <!-- Products Grid Cards -->
            <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="prod in products"
                :key="prod.id"
                class="group flex flex-col justify-between rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-sm transition-all hover:border-[#65975d]/50 hover:shadow-md"
              >
                <div>
                  <!-- Top Row: Category & Flagship Toggle -->
                  <div class="flex items-center justify-between">
                    <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="prod.badge">
                      {{ prod.category }}
                    </span>

                    <!-- Flagship star toggle -->
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition"
                      :class="prod.isTopFlagship ? 'bg-[#faeedd] text-[#744510] border border-[#e2be8a]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                      :title="prod.isTopFlagship ? 'Featured in Home Page top 3' : 'Click to feature on Home Page'"
                      @click="toggleFlagship(prod)"
                    >
                      <span>★</span>
                      <span>{{ prod.isTopFlagship ? 'Top 3 Flagship' : 'Standard' }}</span>
                    </button>
                  </div>

                  <!-- Bottle Image Thumbnail -->
                  <div class="my-4 flex h-40 items-center justify-center rounded-2xl bg-[#f7faf4] p-3">
                    <img
                      :src="prod.image"
                      :alt="prod.name"
                      class="h-36 w-auto max-w-[90px] object-contain drop-shadow-md"
                    />
                  </div>

                  <!-- Name and Specs -->
                  <div class="flex items-baseline justify-between">
                    <h3 class="font-serif text-xl font-semibold text-[#173b2b]">{{ prod.name }}</h3>
                    <span class="text-xs text-[#779277]">{{ prod.abv }} · {{ prod.volume }}</span>
                  </div>

                  <p class="mt-2 line-clamp-2 text-xs leading-relaxed text-[#54715a]">
                    {{ prod.note }}
                  </p>

                  <!-- Tasting note snippet -->
                  <div class="mt-3 rounded-xl bg-[#edf5e9]/50 p-2.5 text-[11px] text-[#2c5339]">
                    <span class="font-semibold text-[#1f402b]">Nose:</span> {{ prod.aroma || 'Botanical bouquet' }}
                  </div>
                </div>

                <!-- Card Actions -->
                <div class="mt-5 flex items-center justify-between border-t border-[#edf2e9] pt-4">
                  <button
                    type="button"
                    class="rounded-full bg-[#173b2b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#35653c]"
                    @click="openEditModal(prod)"
                  >
                    Edit Info ✎
                  </button>

                  <button
                    type="button"
                    class="text-xs text-red-600 transition hover:text-red-800"
                    title="Delete product"
                    @click="removeProduct(prod.id, prod.name)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- OVERVIEW TAB -->
          <div v-else-if="activeTab === 'Overview'">
            <div class="grid gap-4 sm:grid-cols-3">
              <div v-for="stat in stats" :key="stat.label" class="rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-sm">
                <p class="text-xs uppercase tracking-wider text-[#66816b]">{{ stat.label }}</p>
                <strong class="mt-2 block font-serif text-3xl font-bold text-[#173b2b]">{{ stat.value }}</strong>
              </div>
            </div>

            <div class="mt-8 rounded-3xl border border-[#dfe9da] bg-white p-7 shadow-sm">
              <h2 class="font-serif text-2xl font-semibold">JSON Data Persistence</h2>
              <p class="mt-2 max-w-xl text-sm leading-relaxed text-[#54715a]">
                All product information is maintained in structured JSON (<code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs">app/data/products.json</code>).
                When edits are made in this Admin panel, they are saved to your browser state immediately and can be exported as a fresh JSON file with one click.
              </p>
              <div class="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  class="rounded-full bg-[#173b2b] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#35653c]"
                  @click="activeTab = 'Products'"
                >
                  Manage Products Catalogue →
                </button>
              </div>
            </div>
          </div>

          <!-- OTHER TABS (Events, Blog, Vacancies) -->
          <div v-else class="rounded-3xl border border-[#dfe9da] bg-white p-7 shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p class="eyebrow">{{ activeTab }}</p>
                <h2 class="mt-1 font-serif text-2xl font-semibold">Manage {{ activeTab.toLowerCase() }}</h2>
              </div>
              <button
                type="button"
                class="rounded-full bg-[#173b2b] px-5 py-2.5 text-xs font-semibold text-white"
                @click="notify('Draft saved!')"
              >
                + Create new
              </button>
            </div>
            <div class="mt-6 grid gap-3">
              <div v-for="i in 3" :key="i" class="flex items-center justify-between rounded-2xl border border-[#edf2e9] p-4 text-sm">
                <div>
                  <h3 class="font-semibold text-[#173b2b]">
                    {{
                      activeTab === 'Events'
                        ? ['Desta Tasting Table', 'Taste of Ethiopia', 'Craft & Culture'][i - 1]
                        : activeTab === 'Blog posts'
                        ? ['The botanicals that make our gin…', 'A better highball starts with patience', 'Inside the new generation of Addis…'][i - 1]
                        : ['Brand & Partnerships Manager', 'Production Quality Lead', 'Trade Marketing Associate'][i - 1]
                    }}
                  </h3>
                  <p class="mt-0.5 text-xs text-[#779277]">Published · Last edited {{ i }} day{{ i > 1 ? 's' : '' }} ago</p>
                </div>
                <button
                  type="button"
                  class="rounded-full border border-[#b8d7af] px-3.5 py-1 text-xs font-medium text-[#35653c] hover:bg-[#edf5e9]"
                  @click="notify('Opened draft editor!')"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- PRODUCT EDIT MODAL FOR NON-DEVS -->
    <Teleport to="body">
      <div
        v-if="isEditModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isEditModalOpen = false"></div>

        <div class="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#dce8d7] bg-[#fffdf9] p-6 text-[#173b2b] shadow-2xl sm:p-8">
          <div class="flex items-center justify-between border-b border-[#e4ede1] pb-4">
            <div>
              <p class="text-xs uppercase tracking-wider text-[#65975d]">Product Editor (JSON)</p>
              <h2 class="font-serif text-2xl font-semibold">
                {{ isNewProduct ? 'Add New Product' : `Edit ${productForm.name}` }}
              </h2>
            </div>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100"
              @click="isEditModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="mt-6 space-y-4 text-xs" @submit.prevent="saveProductChanges">
            <!-- Name & Category -->
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="block font-semibold text-[#173b2b]">Product Name</label>
                <input v-model="productForm.name" required class="field" placeholder="e.g. Desta Dry Gin" />
              </div>

              <div>
                <label class="block font-semibold text-[#173b2b]">Category</label>
                <input v-model="productForm.category" required class="field" placeholder="e.g. London Dry Gin" />
              </div>
            </div>

            <!-- Volume, ABV, Image Selection -->
            <div class="grid gap-4 sm:grid-cols-3">
              <div>
                <label class="block font-semibold text-[#173b2b]">ABV (% Alcohol)</label>
                <input v-model="productForm.abv" required class="field" placeholder="e.g. 40% Vol." />
              </div>

              <div>
                <label class="block font-semibold text-[#173b2b]">Volume</label>
                <input v-model="productForm.volume" required class="field" placeholder="e.g. 750ml" />
              </div>

              <div>
                <label class="block font-semibold text-[#173b2b]">Bottle Image Model</label>
                <select v-model="productForm.imageKey" class="field bg-white">
                  <option v-for="key in availableImageKeys" :key="key" :value="key">
                    {{ key.toUpperCase() }} bottle
                  </option>
                </select>
              </div>
            </div>

            <!-- Description / Note -->
            <div>
              <label class="block font-semibold text-[#173b2b]">Description / Note</label>
              <textarea
                v-model="productForm.note"
                required
                rows="2"
                class="field resize-y"
                placeholder="Brief product description for cards..."
              ></textarea>
            </div>

            <!-- Detailed Tasting Notes Section -->
            <div class="rounded-2xl border border-[#dce8d7] bg-[#f8fbf6] p-4 space-y-3">
              <p class="font-semibold text-xs text-[#2c6338] uppercase tracking-wider">Tasting Profile (Shown in Modal)</p>

              <div>
                <label class="block font-medium text-[#173b2b]">Aroma (Nose)</label>
                <input v-model="productForm.aroma" class="field bg-white" placeholder="e.g. Wild highland juniper, fresh lime peel..." />
              </div>

              <div>
                <label class="block font-medium text-[#173b2b]">Palate (Taste)</label>
                <input v-model="productForm.palate" class="field bg-white" placeholder="e.g. Zesty citrus entry, herbal pine richness..." />
              </div>

              <div>
                <label class="block font-medium text-[#173b2b]">Finish</label>
                <input v-model="productForm.finish" class="field bg-white" placeholder="e.g. Crisp, lingering dry finish..." />
              </div>

              <div>
                <label class="block font-medium text-[#173b2b]">Serving Suggestion</label>
                <input v-model="productForm.serving" class="field bg-white" placeholder="e.g. Serve over clear ice with premium tonic water..." />
              </div>
            </div>

            <!-- Top Flagship Toggle -->
            <div class="flex items-center gap-3 rounded-xl border border-[#e4ede1] bg-white p-3.5">
              <input
                id="flagship_toggle"
                v-model="productForm.isTopFlagship"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-[#173b2b] focus:ring-[#65975d]"
              />
              <label for="flagship_toggle" class="cursor-pointer select-none text-xs font-semibold text-[#173b2b]">
                Feature as one of Top 3 Flagships on Home Page
              </label>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 border-t border-[#e4ede1] pt-4">
              <button
                type="button"
                class="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                @click="isEditModalOpen = false"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="rounded-full bg-[#173b2b] px-6 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-[#35653c]"
              >
                Save Product Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- IMPORT JSON MODAL -->
    <Teleport to="body">
      <div
        v-if="showImportModal"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showImportModal = false"></div>

        <div class="relative z-10 w-full max-w-lg rounded-3xl border border-[#dce8d7] bg-[#fffdf9] p-6 text-[#173b2b] shadow-2xl">
          <div class="flex items-center justify-between border-b border-[#e4ede1] pb-3">
            <h3 class="font-serif text-xl font-semibold">Import Products JSON</h3>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
              @click="showImportModal = false"
            >
              ✕
            </button>
          </div>

          <div class="mt-4 space-y-4 text-xs">
            <div>
              <label class="block font-semibold">Upload products.json File:</label>
              <input
                type="file"
                accept=".json,application/json"
                class="mt-1.5 block w-full text-xs text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#173b2b] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#35653c]"
                @change="handleFileUpload"
              />
            </div>

            <div class="relative flex items-center py-1">
              <div class="flex-grow border-t border-gray-200"></div>
              <span class="mx-3 shrink text-gray-400">or paste JSON</span>
              <div class="flex-grow border-t border-gray-200"></div>
            </div>

            <div>
              <label class="block font-semibold">Paste JSON Array:</label>
              <textarea
                v-model="importJsonText"
                rows="6"
                class="field font-mono text-[11px]"
                placeholder='[ { "id": "gin", "name": "Desta Dry Gin", ... } ]'
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                class="rounded-full border border-gray-300 px-4 py-2 text-xs"
                @click="showImportModal = false"
              >
                Cancel
              </button>
              <button
                type="button"
                class="rounded-full bg-[#173b2b] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#35653c]"
                @click="handleImport"
              >
                Apply JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
