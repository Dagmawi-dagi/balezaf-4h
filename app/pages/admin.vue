<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
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
  }, 3200)
}

// ----------------------------------------------------
// 1. PRODUCTS MANAGEMENT
// ----------------------------------------------------
const editingProduct = ref<ProductItem | null>(null)
const isProductModalOpen = ref(false)
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

function openProductEditModal(prod: any) {
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
  isProductModalOpen.value = true
}

function openProductAddModal() {
  isNewProduct.value = true
  editingProduct.value = null
  const newId = 'prod_' + Date.now().toString(36)
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
    aroma: 'Fresh citrus, wild botanicals, and warm spice.',
    palate: 'Silky texture with balanced sweetness and natural warmth.',
    finish: 'Crisp, lingering aromatic finish.',
    serving: 'Serve chilled or on the rocks.',
    isTopFlagship: false,
  })
  isProductModalOpen.value = true
}

function saveProductChanges() {
  if (isNewProduct.value) {
    addProduct({ ...productForm })
    notify(`Created product "${productForm.name}" successfully!`)
  } else if (editingProduct.value) {
    updateProduct(editingProduct.value.id, { ...productForm })
    notify(`Saved changes for "${productForm.name}"!`)
  }
  isProductModalOpen.value = false
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

// ----------------------------------------------------
// 2. EVENTS MANAGEMENT
// ----------------------------------------------------
interface EventItem {
  id: string
  title: string
  date: string
  place: string
  category: string
  text: string
  status: string
}

const events = ref<EventItem[]>([
  {
    id: 'evt-1',
    title: 'Desta Tasting Table',
    date: '18 May 2026',
    place: 'Desta House · Addis Ababa',
    category: 'UPCOMING EVENT',
    text: 'An intimate evening exploring our newest botanical spirits and seasonal serves with our master distillers.',
    status: 'Published',
  },
  {
    id: 'evt-2',
    title: 'Taste of Ethiopia',
    date: '06 June 2026',
    place: 'Millennium Hall · Addis Ababa',
    category: 'UPCOMING EVENT',
    text: 'Meet our makers and discover the indigenous botanicals behind Ethiopia’s modern spirits.',
    status: 'Published',
  },
  {
    id: 'evt-3',
    title: 'Craft & Culture Gala',
    date: '24 July 2026',
    place: 'The Skylight Garden · Addis Ababa',
    category: 'UPCOMING EVENT',
    text: 'A creative gathering pairing local culinary craft, live music, and considered cocktail pairings.',
    status: 'Published',
  },
])

const isEventModalOpen = ref(false)
const isNewEvent = ref(false)
const editingEventId = ref<string | null>(null)

const eventForm = reactive<EventItem>({
  id: '',
  title: '',
  date: '',
  place: '',
  category: 'UPCOMING EVENT',
  text: '',
  status: 'Published',
})

function openEventCreateModal() {
  isNewEvent.value = true
  editingEventId.value = null
  Object.assign(eventForm, {
    id: 'evt_' + Date.now().toString(36),
    title: '',
    date: '15 August 2026',
    place: 'Balezaf House · Addis Ababa',
    category: 'UPCOMING EVENT',
    text: '',
    status: 'Published',
  })
  isEventModalOpen.value = true
}

function openEventEditModal(evt: EventItem) {
  isNewEvent.value = false
  editingEventId.value = evt.id
  Object.assign(eventForm, { ...evt })
  isEventModalOpen.value = true
}

function saveEventChanges() {
  if (!eventForm.title.trim()) return
  if (isNewEvent.value) {
    events.value.unshift({ ...eventForm })
    notify(`Created event "${eventForm.title}"!`)
  } else {
    const idx = events.value.findIndex((e) => e.id === editingEventId.value)
    if (idx !== -1) {
      events.value[idx] = { ...eventForm }
      notify(`Updated event "${eventForm.title}"!`)
    }
  }
  saveEventsToStorage()
  isEventModalOpen.value = false
}

function removeEvent(id: string, title: string) {
  if (confirm(`Delete event "${title}"?`)) {
    events.value = events.value.filter((e) => e.id !== id)
    saveEventsToStorage()
    notify(`Deleted event "${title}".`)
  }
}

function saveEventsToStorage() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('balezaf_events', JSON.stringify(events.value))
  }
}

// ----------------------------------------------------
// 3. BLOG POSTS MANAGEMENT
// ----------------------------------------------------
interface BlogPostItem {
  id: string
  title: string
  category: string
  date: string
  author: string
  image: string
  text: string
  status: string
}

const blogPosts = ref<BlogPostItem[]>([
  {
    id: 'post-1',
    title: 'The botanicals that make our gin unmistakably Ethiopian',
    category: 'MAKING BALEZAF',
    date: '12 April 2026',
    author: 'Distillery Team',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balezaf_blog_bg_green-VvU1YVwjlyPHJV2gYJlczTbYJ6iLwp.png',
    text: 'From bright highland citrus to fragrant kosoret and wild angelica, explore the local ingredients that shape our signature botanical profile.',
    status: 'Published',
  },
  {
    id: 'post-2',
    title: 'A better highball starts with patience',
    category: 'SERVE NOTES',
    date: '28 March 2026',
    author: 'Beverage Director',
    image: '',
    text: 'A simple ritual for a fresh, balanced serve that lets every aromatic note in the bottle breathe naturally.',
    status: 'Published',
  },
  {
    id: 'post-3',
    title: 'Inside the new generation of Addis hospitality',
    category: 'PEOPLE & PLACE',
    date: '04 February 2026',
    author: 'Balezaf Editorial',
    image: '',
    text: 'The bartenders, chefs, and hosts building a more generous and vibrant drinks culture in the heart of Ethiopia.',
    status: 'Published',
  },
])

const isBlogModalOpen = ref(false)
const isNewBlog = ref(false)
const editingBlogId = ref<string | null>(null)

const blogForm = reactive<BlogPostItem>({
  id: '',
  title: '',
  category: 'MAKING BALEZAF',
  date: '',
  author: 'Distillery Team',
  image: '',
  text: '',
  status: 'Published',
})

function openBlogCreateModal() {
  isNewBlog.value = true
  editingBlogId.value = null
  Object.assign(blogForm, {
    id: 'post_' + Date.now().toString(36),
    title: '',
    category: 'MAKING BALEZAF',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    author: 'Distillery Team',
    image: '',
    text: '',
    status: 'Published',
  })
  isBlogModalOpen.value = true
}

function openBlogEditModal(post: BlogPostItem) {
  isNewBlog.value = false
  editingBlogId.value = post.id
  Object.assign(blogForm, { ...post })
  isBlogModalOpen.value = true
}

function saveBlogChanges() {
  if (!blogForm.title.trim()) return
  if (isNewBlog.value) {
    blogPosts.value.unshift({ ...blogForm })
    notify(`Published post "${blogForm.title}"!`)
  } else {
    const idx = blogPosts.value.findIndex((p) => p.id === editingBlogId.value)
    if (idx !== -1) {
      blogPosts.value[idx] = { ...blogForm }
      notify(`Updated post "${blogForm.title}"!`)
    }
  }
  saveBlogToStorage()
  isBlogModalOpen.value = false
}

function removeBlogPost(id: string, title: string) {
  if (confirm(`Delete post "${title}"?`)) {
    blogPosts.value = blogPosts.value.filter((p) => p.id !== id)
    saveBlogToStorage()
    notify(`Deleted post "${title}".`)
  }
}

function saveBlogToStorage() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('balezaf_blog_posts', JSON.stringify(blogPosts.value))
  }
}

// ----------------------------------------------------
// 4. JOB VACANCIES MANAGEMENT
// ----------------------------------------------------
interface JobItem {
  id: string
  title: string
  team: string
  type: string
  description: string
  status: string
}

const jobVacancies = ref<JobItem[]>([
  {
    id: 'job-1',
    title: 'Brand & Partnerships Manager',
    team: 'Growth · Addis Ababa',
    type: 'Full-time',
    description: 'Lead brand collaborations with top hospitality venues, cultural festivals, and creative partners.',
    status: 'Open',
  },
  {
    id: 'job-2',
    title: 'Production Quality Lead',
    team: 'Distillery · Addis Ababa',
    type: 'Full-time',
    description: 'Ensure international spirits quality standards across botanical extraction, distillation, and bottling.',
    status: 'Open',
  },
  {
    id: 'job-3',
    title: 'Trade Marketing Associate',
    team: 'Commercial · Addis Ababa',
    type: 'Full-time',
    description: 'Execute retail and on-premise promotional programs across Addis Ababa and regional distribution hubs.',
    status: 'Open',
  },
])

const isJobModalOpen = ref(false)
const isNewJob = ref(false)
const editingJobId = ref<string | null>(null)

const jobForm = reactive<JobItem>({
  id: '',
  title: '',
  team: 'Distillery · Addis Ababa',
  type: 'Full-time',
  description: '',
  status: 'Open',
})

function openJobCreateModal() {
  isNewJob.value = true
  editingJobId.value = null
  Object.assign(jobForm, {
    id: 'job_' + Date.now().toString(36),
    title: '',
    team: 'Operations · Addis Ababa',
    type: 'Full-time',
    description: '',
    status: 'Open',
  })
  isJobModalOpen.value = true
}

function openJobEditModal(job: JobItem) {
  isNewJob.value = false
  editingJobId.value = job.id
  Object.assign(jobForm, { ...job })
  isJobModalOpen.value = true
}

function saveJobChanges() {
  if (!jobForm.title.trim()) return
  if (isNewJob.value) {
    jobVacancies.value.unshift({ ...jobForm })
    notify(`Created vacancy "${jobForm.title}"!`)
  } else {
    const idx = jobVacancies.value.findIndex((j) => j.id === editingJobId.value)
    if (idx !== -1) {
      jobVacancies.value[idx] = { ...jobForm }
      notify(`Updated vacancy "${jobForm.title}"!`)
    }
  }
  saveJobsToStorage()
  isJobModalOpen.value = false
}

function removeJob(id: string, title: string) {
  if (confirm(`Delete vacancy "${title}"?`)) {
    jobVacancies.value = jobVacancies.value.filter((j) => j.id !== id)
    saveJobsToStorage()
    notify(`Deleted vacancy "${title}".`)
  }
}

function saveJobsToStorage() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('balezaf_jobs', JSON.stringify(jobVacancies.value))
  }
}

// ----------------------------------------------------
// 5. JSON IMPORT / EXPORT MODAL
// ----------------------------------------------------
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

// Hydrate from localStorage on mounted
onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const storedEvt = localStorage.getItem('balezaf_events')
      if (storedEvt) events.value = JSON.parse(storedEvt)
      const storedBlog = localStorage.getItem('balezaf_blog_posts')
      if (storedBlog) blogPosts.value = JSON.parse(storedBlog)
      const storedJobs = localStorage.getItem('balezaf_jobs')
      if (storedJobs) jobVacancies.value = JSON.parse(storedJobs)
    } catch (e) {
      console.warn('Could not load custom content from localStorage', e)
    }
  }
})

useSeoMeta({
  title: 'Content Admin Workspace | Balezaf Spirits',
  description: 'Manage products catalogue, tasting notes, events, journal stories, and job vacancies.',
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
            <span
              v-else-if="tab === 'Events'"
              class="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white"
            >
              {{ events.length }}
            </span>
            <span
              v-else-if="tab === 'Blog posts'"
              class="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white"
            >
              {{ blogPosts.length }}
            </span>
            <span
              v-else-if="tab === 'Job vacancies'"
              class="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white"
            >
              {{ jobVacancies.length }}
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
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#65975d]">Content Management Studio</p>
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
          <!-- 1. PRODUCTS TAB -->
          <div v-if="activeTab === 'Products'">
            <!-- Controls Bar -->
            <div class="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-sm">
              <div>
                <h2 class="font-serif text-2xl font-semibold">Products Catalogue (JSON)</h2>
                <p class="mt-1 text-xs text-[#66816b]">
                  Edit product details, tasting profiles, and choose the 3 home page flagships. Non-dev friendly.
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full border border-[#b8cdb6] bg-white px-4 py-2 text-xs font-semibold text-[#2b5837] shadow-xs transition hover:bg-[#edf5e9]"
                  title="Download products.json"
                  @click="downloadJsonFile"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export products.json</span>
                </button>

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

                <button
                  type="button"
                  class="rounded-full border border-gray-200 px-3.5 py-2 text-xs text-gray-500 transition hover:bg-gray-100"
                  @click="handleResetDefaults"
                >
                  Reset Factory
                </button>

                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full bg-[#173b2b] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#35653c]"
                  @click="openProductAddModal"
                >
                  <span>+ Create New Product</span>
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
                  <div class="flex items-center justify-between">
                    <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="prod.badge">
                      {{ prod.category }}
                    </span>

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

                  <div class="my-4 flex h-40 items-center justify-center rounded-2xl bg-[#f7faf4] p-3">
                    <img
                      :src="prod.image"
                      :alt="prod.name"
                      class="h-36 w-auto max-w-[90px] object-contain drop-shadow-md"
                    />
                  </div>

                  <div class="flex items-baseline justify-between">
                    <h3 class="font-serif text-xl font-semibold text-[#173b2b]">{{ prod.name }}</h3>
                    <span class="text-xs text-[#779277]">{{ prod.abv }} · {{ prod.volume }}</span>
                  </div>

                  <p class="mt-2 line-clamp-2 text-xs leading-relaxed text-[#54715a]">
                    {{ prod.note }}
                  </p>
                </div>

                <div class="mt-5 flex items-center justify-between border-t border-[#edf2e9] pt-4">
                  <button
                    type="button"
                    class="rounded-full bg-[#173b2b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#35653c]"
                    @click="openProductEditModal(prod)"
                  >
                    Edit Product ✎
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

          <!-- 2. OVERVIEW TAB -->
          <div v-else-if="activeTab === 'Overview'">
            <div class="grid gap-4 sm:grid-cols-4">
              <div class="rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-sm">
                <p class="text-xs uppercase tracking-wider text-[#66816b]">Total Products</p>
                <strong class="mt-2 block font-serif text-3xl font-bold text-[#173b2b]">{{ products.length }}</strong>
                <button class="mt-3 text-xs font-semibold text-[#3e7647]" @click="activeTab = 'Products'">
                  Manage catalogue →
                </button>
              </div>

              <div class="rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-sm">
                <p class="text-xs uppercase tracking-wider text-[#66816b]">Published Events</p>
                <strong class="mt-2 block font-serif text-3xl font-bold text-[#173b2b]">{{ events.length }}</strong>
                <button class="mt-3 text-xs font-semibold text-[#3e7647]" @click="activeTab = 'Events'">
                  Manage events →
                </button>
              </div>

              <div class="rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-sm">
                <p class="text-xs uppercase tracking-wider text-[#66816b]">Journal Posts</p>
                <strong class="mt-2 block font-serif text-3xl font-bold text-[#173b2b]">{{ blogPosts.length }}</strong>
                <button class="mt-3 text-xs font-semibold text-[#3e7647]" @click="activeTab = 'Blog posts'">
                  Manage posts →
                </button>
              </div>

              <div class="rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-sm">
                <p class="text-xs uppercase tracking-wider text-[#66816b]">Open Vacancies</p>
                <strong class="mt-2 block font-serif text-3xl font-bold text-[#173b2b]">{{ jobVacancies.length }}</strong>
                <button class="mt-3 text-xs font-semibold text-[#3e7647]" @click="activeTab = 'Job vacancies'">
                  Manage careers →
                </button>
              </div>
            </div>

            <!-- Quick Creation Actions -->
            <div class="mt-8 rounded-3xl border border-[#dfe9da] bg-white p-8 shadow-sm">
              <h2 class="font-serif text-2xl font-semibold">Quick Create Actions</h2>
              <p class="mt-1 text-sm text-[#54715a]">
                Launch creation modals directly from your dashboard:
              </p>

              <div class="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  class="rounded-full bg-[#173b2b] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#35653c]"
                  @click="openProductAddModal"
                >
                  + Create Product
                </button>
                <button
                  type="button"
                  class="rounded-full border border-[#173b2b] px-5 py-2.5 text-xs font-semibold text-[#173b2b] transition hover:bg-[#edf5e9]"
                  @click="openEventCreateModal"
                >
                  + Create Event
                </button>
                <button
                  type="button"
                  class="rounded-full border border-[#173b2b] px-5 py-2.5 text-xs font-semibold text-[#173b2b] transition hover:bg-[#edf5e9]"
                  @click="openBlogCreateModal"
                >
                  + Create Journal Post
                </button>
                <button
                  type="button"
                  class="rounded-full border border-[#173b2b] px-5 py-2.5 text-xs font-semibold text-[#173b2b] transition hover:bg-[#edf5e9]"
                  @click="openJobCreateModal"
                >
                  + Post Vacancy
                </button>
              </div>
            </div>
          </div>

          <!-- 3. EVENTS TAB -->
          <div v-else-if="activeTab === 'Events'" class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-sm">
              <div>
                <h2 class="font-serif text-2xl font-semibold">Distillery Events &amp; Tastings</h2>
                <p class="mt-1 text-xs text-[#66816b]">Manage upcoming tastings, cultural dinners, and community gatherings.</p>
              </div>
              <button
                type="button"
                class="rounded-full bg-[#173b2b] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#35653c]"
                @click="openEventCreateModal"
              >
                + Create New Event
              </button>
            </div>

            <div class="grid gap-4">
              <div
                v-for="evt in events"
                :key="evt.id"
                class="flex flex-col justify-between gap-4 rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-xs sm:flex-row sm:items-center"
              >
                <div>
                  <div class="flex items-center gap-2.5">
                    <span class="rounded-full bg-[#edf5e9] px-2.5 py-0.5 text-[11px] font-semibold text-[#2b5837]">
                      {{ evt.date }}
                    </span>
                    <span class="text-xs text-[#8eaa86]">· {{ evt.place }}</span>
                    <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {{ evt.status }}
                    </span>
                  </div>
                  <h3 class="mt-2 font-serif text-xl font-semibold text-[#173b2b]">{{ evt.title }}</h3>
                  <p class="mt-1 max-w-2xl text-xs leading-relaxed text-[#54715a]">{{ evt.text }}</p>
                </div>

                <div class="flex items-center gap-2.5">
                  <button
                    type="button"
                    class="rounded-full bg-[#173b2b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#35653c]"
                    @click="openEventEditModal(evt)"
                  >
                    Edit ✎
                  </button>
                  <button
                    type="button"
                    class="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-50"
                    @click="removeEvent(evt.id, evt.title)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. BLOG POSTS TAB -->
          <div v-else-if="activeTab === 'Blog posts'" class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-sm">
              <div>
                <h2 class="font-serif text-2xl font-semibold">Journal Stories &amp; Articles</h2>
                <p class="mt-1 text-xs text-[#66816b]">Publish insights into distillation, botanical sourcing, and drinks culture.</p>
              </div>
              <button
                type="button"
                class="rounded-full bg-[#173b2b] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#35653c]"
                @click="openBlogCreateModal"
              >
                + Create New Post
              </button>
            </div>

            <div class="grid gap-4">
              <div
                v-for="post in blogPosts"
                :key="post.id"
                class="flex flex-col justify-between gap-4 rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-xs sm:flex-row sm:items-center"
              >
                <div>
                  <div class="flex items-center gap-2.5">
                    <span class="rounded-full bg-[#edf5e9] px-2.5 py-0.5 text-[11px] font-semibold text-[#2b5837]">
                      {{ post.category }}
                    </span>
                    <span class="text-xs text-[#8eaa86]">· {{ post.date }}</span>
                    <span class="text-xs text-[#8eaa86]">· By {{ post.author }}</span>
                  </div>
                  <h3 class="mt-2 font-serif text-xl font-semibold text-[#173b2b]">{{ post.title }}</h3>
                  <p class="mt-1 max-w-2xl text-xs leading-relaxed text-[#54715a]">{{ post.text }}</p>
                </div>

                <div class="flex items-center gap-2.5">
                  <button
                    type="button"
                    class="rounded-full bg-[#173b2b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#35653c]"
                    @click="openBlogEditModal(post)"
                  >
                    Edit ✎
                  </button>
                  <button
                    type="button"
                    class="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-50"
                    @click="removeBlogPost(post.id, post.title)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. JOB VACANCIES TAB -->
          <div v-else-if="activeTab === 'Job vacancies'" class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-sm">
              <div>
                <h2 class="font-serif text-2xl font-semibold">Careers &amp; Job Vacancies</h2>
                <p class="mt-1 text-xs text-[#66816b]">Post new positions across distillery production, quality, marketing, and management.</p>
              </div>
              <button
                type="button"
                class="rounded-full bg-[#173b2b] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#35653c]"
                @click="openJobCreateModal"
              >
                + Create New Vacancy
              </button>
            </div>

            <div class="grid gap-4">
              <div
                v-for="job in jobVacancies"
                :key="job.id"
                class="flex flex-col justify-between gap-4 rounded-3xl border border-[#dfe9da] bg-white p-6 shadow-xs sm:flex-row sm:items-center"
              >
                <div>
                  <div class="flex items-center gap-2.5">
                    <span class="rounded-full bg-[#edf5e9] px-2.5 py-0.5 text-[11px] font-semibold text-[#2b5837]">
                      {{ job.type }}
                    </span>
                    <span class="text-xs text-[#8eaa86]">· {{ job.team }}</span>
                    <span
                      class="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      :class="job.status === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'"
                    >
                      {{ job.status }}
                    </span>
                  </div>
                  <h3 class="mt-2 font-serif text-xl font-semibold text-[#173b2b]">{{ job.title }}</h3>
                  <p class="mt-1 max-w-2xl text-xs leading-relaxed text-[#54715a]">{{ job.description }}</p>
                </div>

                <div class="flex items-center gap-2.5">
                  <button
                    type="button"
                    class="rounded-full bg-[#173b2b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#35653c]"
                    @click="openJobEditModal(job)"
                  >
                    Edit ✎
                  </button>
                  <button
                    type="button"
                    class="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-50"
                    @click="removeJob(job.id, job.title)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- ============================================== -->
    <!-- MODAL 1: PRODUCT CREATE / EDIT MODAL           -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="isProductModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isProductModalOpen = false"></div>

        <div class="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#dce8d7] bg-[#fffdf9] p-6 text-[#173b2b] shadow-2xl sm:p-8">
          <div class="flex items-center justify-between border-b border-[#e4ede1] pb-4">
            <div>
              <p class="text-xs uppercase tracking-wider text-[#65975d]">Product Catalogue</p>
              <h2 class="font-serif text-2xl font-semibold">
                {{ isNewProduct ? 'Create New Product' : `Edit ${productForm.name}` }}
              </h2>
            </div>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100"
              @click="isProductModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="mt-6 space-y-4 text-xs" @submit.prevent="saveProductChanges">
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

            <div>
              <label class="block font-semibold text-[#173b2b]">Card Description / Note</label>
              <textarea
                v-model="productForm.note"
                required
                rows="2"
                class="field resize-y"
                placeholder="Product description for cards..."
              ></textarea>
            </div>

            <div class="rounded-2xl border border-[#dce8d7] bg-[#f8fbf6] p-4 space-y-3">
              <p class="font-semibold text-xs text-[#2c6338] uppercase tracking-wider">Tasting Profile (Shown in Modal)</p>
              <div>
                <label class="block font-medium text-[#173b2b]">Aroma (Nose)</label>
                <input v-model="productForm.aroma" class="field bg-white" placeholder="e.g. Wild highland juniper, fresh lime..." />
              </div>
              <div>
                <label class="block font-medium text-[#173b2b]">Palate (Taste)</label>
                <input v-model="productForm.palate" class="field bg-white" placeholder="e.g. Zesty citrus entry, herbal pine..." />
              </div>
              <div>
                <label class="block font-medium text-[#173b2b]">Finish</label>
                <input v-model="productForm.finish" class="field bg-white" placeholder="e.g. Crisp, lingering dry finish..." />
              </div>
              <div>
                <label class="block font-medium text-[#173b2b]">Serving Suggestion</label>
                <input v-model="productForm.serving" class="field bg-white" placeholder="e.g. Serve over clear ice with tonic..." />
              </div>
            </div>

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

            <div class="flex items-center justify-end gap-3 border-t border-[#e4ede1] pt-4">
              <button
                type="button"
                class="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                @click="isProductModalOpen = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-full bg-[#173b2b] px-6 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-[#35653c]"
              >
                {{ isNewProduct ? 'Create Product' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL 2: EVENT CREATE / EDIT MODAL             -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="isEventModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isEventModalOpen = false"></div>

        <div class="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#dce8d7] bg-[#fffdf9] p-6 text-[#173b2b] shadow-2xl sm:p-8">
          <div class="flex items-center justify-between border-b border-[#e4ede1] pb-4">
            <div>
              <p class="text-xs uppercase tracking-wider text-[#65975d]">Events Studio</p>
              <h2 class="font-serif text-2xl font-semibold">
                {{ isNewEvent ? 'Create New Event' : 'Edit Event' }}
              </h2>
            </div>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100"
              @click="isEventModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="mt-6 space-y-4 text-xs" @submit.prevent="saveEventChanges">
            <div>
              <label class="block font-semibold text-[#173b2b]">Event Title</label>
              <input v-model="eventForm.title" required class="field" placeholder="e.g. Balezaf Tasting Table" />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="block font-semibold text-[#173b2b]">Date</label>
                <input v-model="eventForm.date" required class="field" placeholder="e.g. 18 May 2026" />
              </div>
              <div>
                <label class="block font-semibold text-[#173b2b]">Category</label>
                <input v-model="eventForm.category" required class="field" placeholder="e.g. UPCOMING EVENT" />
              </div>
            </div>

            <div>
              <label class="block font-semibold text-[#173b2b]">Location / Venue</label>
              <input v-model="eventForm.place" required class="field" placeholder="e.g. Balezaf House · Addis Ababa" />
            </div>

            <div>
              <label class="block font-semibold text-[#173b2b]">Event Description</label>
              <textarea
                v-model="eventForm.text"
                required
                rows="3"
                class="field resize-y"
                placeholder="What can guests expect at this gathering?"
              ></textarea>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="block font-semibold text-[#173b2b]">Status</label>
                <select v-model="eventForm.status" class="field bg-white">
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-[#e4ede1] pt-4">
              <button
                type="button"
                class="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                @click="isEventModalOpen = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-full bg-[#173b2b] px-6 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-[#35653c]"
              >
                {{ isNewEvent ? 'Create Event' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL 3: BLOG POST CREATE / EDIT MODAL         -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="isBlogModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isBlogModalOpen = false"></div>

        <div class="relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#dce8d7] bg-[#fffdf9] p-6 text-[#173b2b] shadow-2xl sm:p-8">
          <div class="flex items-center justify-between border-b border-[#e4ede1] pb-4">
            <div>
              <p class="text-xs uppercase tracking-wider text-[#65975d]">Journal Studio</p>
              <h2 class="font-serif text-2xl font-semibold">
                {{ isNewBlog ? 'Create New Story' : 'Edit Story' }}
              </h2>
            </div>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100"
              @click="isBlogModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="mt-6 space-y-4 text-xs" @submit.prevent="saveBlogChanges">
            <div>
              <label class="block font-semibold text-[#173b2b]">Story Title</label>
              <input v-model="blogForm.title" required class="field" placeholder="e.g. The botanicals that make our gin..." />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="block font-semibold text-[#173b2b]">Category</label>
                <select v-model="blogForm.category" class="field bg-white">
                  <option value="MAKING BALEZAF">MAKING BALEZAF</option>
                  <option value="SERVE NOTES">SERVE NOTES</option>
                  <option value="PEOPLE &amp; PLACE">PEOPLE &amp; PLACE</option>
                  <option value="HERITAGE">HERITAGE</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-[#173b2b]">Author / Contributor</label>
                <input v-model="blogForm.author" required class="field" placeholder="e.g. Master Distiller" />
              </div>
            </div>

            <div>
              <label class="block font-semibold text-[#173b2b]">Publication Date</label>
              <input v-model="blogForm.date" required class="field" placeholder="e.g. 12 April 2026" />
            </div>

            <div>
              <label class="block font-semibold text-[#173b2b]">Story Content / Excerpt</label>
              <textarea
                v-model="blogForm.text"
                required
                rows="4"
                class="field resize-y"
                placeholder="Write the story or article content..."
              ></textarea>
            </div>

            <div>
              <label class="block font-semibold text-[#173b2b]">Cover Image URL (optional)</label>
              <input v-model="blogForm.image" class="field" placeholder="https://..." />
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-[#e4ede1] pt-4">
              <button
                type="button"
                class="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                @click="isBlogModalOpen = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-full bg-[#173b2b] px-6 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-[#35653c]"
              >
                {{ isNewBlog ? 'Publish Story' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL 4: JOB VACANCY CREATE / EDIT MODAL       -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="isJobModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isJobModalOpen = false"></div>

        <div class="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#dce8d7] bg-[#fffdf9] p-6 text-[#173b2b] shadow-2xl sm:p-8">
          <div class="flex items-center justify-between border-b border-[#e4ede1] pb-4">
            <div>
              <p class="text-xs uppercase tracking-wider text-[#65975d]">Careers Studio</p>
              <h2 class="font-serif text-2xl font-semibold">
                {{ isNewJob ? 'Post New Vacancy' : 'Edit Vacancy' }}
              </h2>
            </div>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100"
              @click="isJobModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="mt-6 space-y-4 text-xs" @submit.prevent="saveJobChanges">
            <div>
              <label class="block font-semibold text-[#173b2b]">Job Role Title</label>
              <input v-model="jobForm.title" required class="field" placeholder="e.g. Brand & Partnerships Manager" />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="block font-semibold text-[#173b2b]">Team &amp; Location</label>
                <input v-model="jobForm.team" required class="field" placeholder="e.g. Commercial · Addis Ababa" />
              </div>

              <div>
                <label class="block font-semibold text-[#173b2b]">Employment Type</label>
                <select v-model="jobForm.type" class="field bg-white">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-[#173b2b]">Role Overview / Key Responsibilities</label>
              <textarea
                v-model="jobForm.description"
                required
                rows="4"
                class="field resize-y"
                placeholder="Brief summary of duties and requirements..."
              ></textarea>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="block font-semibold text-[#173b2b]">Status</label>
                <select v-model="jobForm.status" class="field bg-white">
                  <option value="Open">Open</option>
                  <option value="Closed / Filled">Closed / Filled</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-[#e4ede1] pt-4">
              <button
                type="button"
                class="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                @click="isJobModalOpen = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-full bg-[#173b2b] px-6 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-[#35653c]"
              >
                {{ isNewJob ? 'Post Vacancy' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL 5: IMPORT PRODUCTS JSON MODAL            -->
    <!-- ============================================== -->
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
