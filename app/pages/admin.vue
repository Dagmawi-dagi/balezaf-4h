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
const viewMode = ref<'table' | 'grid'>('table')
const searchQuery = ref('')

const toastMessage = ref('')
const showToast = ref(false)

function notify(msg: string) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2800)
}

// Filtered products based on search
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.note && p.note.toLowerCase().includes(q))
  )
})

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
    name: '',
    category: 'Craft Spirit',
    volume: '750ml',
    abv: '40% Vol.',
    tagline: 'Handcrafted with traditional botanicals and mountain spring water.',
    note: '',
    imageKey: 'gin',
    color: '#52965b',
    glowColor: 'rgba(82, 150, 91, 0.45)',
    aroma: '',
    palate: '',
    finish: '',
    serving: 'Serve chilled over ice.',
    isTopFlagship: false,
  })
  isProductModalOpen.value = true
}

function saveProductChanges() {
  if (!productForm.name.trim()) return
  if (isNewProduct.value) {
    addProduct({ ...productForm })
    notify(`Created "${productForm.name}"!`)
  } else if (editingProduct.value) {
    updateProduct(editingProduct.value.id, { ...productForm })
    notify(`Updated "${productForm.name}"!`)
  }
  isProductModalOpen.value = false
}

function removeProduct(id: string, name: string) {
  if (confirm(`Delete "${name}" from catalogue?`)) {
    deleteProduct(id)
    notify(`Deleted "${name}".`)
  }
}

function toggleFlagship(prod: any) {
  const currentFlagships = products.value.filter((p) => p.isTopFlagship)
  if (!prod.isTopFlagship && currentFlagships.length >= 3) {
    notify('Home page already features 3 flagships. Remove one first.')
    return
  }
  updateProduct(prod.id, { isTopFlagship: !prod.isTopFlagship })
  notify(
    !prod.isTopFlagship
      ? `"${prod.name}" featured on Home Page!`
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
    notify(`Created story "${blogForm.title}"!`)
  } else {
    const idx = blogPosts.value.findIndex((p) => p.id === editingBlogId.value)
    if (idx !== -1) {
      blogPosts.value[idx] = { ...blogForm }
      notify(`Updated story "${blogForm.title}"!`)
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
    notify('Imported product catalogue from JSON!')
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
        showImportModal.value = false
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
  title: 'Admin Workspace | Balezaf Biherawi',
  description: 'Manage products catalogue, tasting profiles, events, journal stories, and job vacancies.',
})
</script>

<template>
  <div class="min-h-screen bg-[#f4f7f2] text-[#173b2b] text-[13px] antialiased">
    <!-- Toast notification -->
    <div
      v-if="showToast"
      class="fixed bottom-5 right-5 z-[200] flex items-center gap-2 rounded-lg border border-[#3e744a] bg-[#173b2b] px-4 py-2.5 text-xs font-medium text-white shadow-lg transition-all"
    >
      <span class="text-[#a4d49a]">✓</span>
      <span>{{ toastMessage }}</span>
    </div>

    <div class="flex min-h-screen">
      <!-- Admin Compact Sidebar -->
      <aside class="hidden w-56 shrink-0 flex-col justify-between border-r border-[#1e4835] bg-[#173b2b] p-4 text-white md:flex">
        <div>
          <!-- Brand Logo -->
          <NuxtLink to="/" class="flex items-center gap-2.5 px-2 py-1.5">
            <div class="flex h-7 w-7 items-center justify-center rounded-md bg-[#c6dfbc] font-serif font-bold text-xs text-[#173b2b]">
              B
            </div>
            <div>
              <span class="block text-xs font-bold tracking-wider uppercase">BALEZAF</span>
              <span class="block text-[10px] text-[#8ebb84]">Admin Workspace</span>
            </div>
          </NuxtLink>

          <!-- Nav Items -->
          <nav class="mt-6 space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab"
              type="button"
              class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-medium transition"
              :class="activeTab === tab ? 'bg-[#2b593a] text-white shadow-xs font-semibold' : 'text-[#bcd5b9] hover:bg-white/10 hover:text-white'"
              @click="activeTab = tab"
            >
              <span>{{ tab }}</span>
              <span
                v-if="tab === 'Products'"
                class="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold"
              >
                {{ products.length }}
              </span>
              <span
                v-else-if="tab === 'Events'"
                class="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold"
              >
                {{ events.length }}
              </span>
              <span
                v-else-if="tab === 'Blog posts'"
                class="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold"
              >
                {{ blogPosts.length }}
              </span>
              <span
                v-else-if="tab === 'Job vacancies'"
                class="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold"
              >
                {{ jobVacancies.length }}
              </span>
            </button>
          </nav>
        </div>

        <div class="border-t border-white/10 pt-3">
          <NuxtLink
            to="/"
            class="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-[#9fc495] transition hover:bg-white/10 hover:text-white"
          >
            <span>← Back to Website</span>
          </NuxtLink>
        </div>
      </aside>

      <!-- Main Workspace -->
      <main class="flex-1 flex flex-col min-w-0">
        <!-- Compact Top App Bar -->
        <header class="flex h-14 items-center justify-between border-b border-[#dce8d7] bg-white px-5 sm:px-6">
          <div class="flex items-center gap-3">
            <!-- Mobile tab switcher for small screens -->
            <select
              v-model="activeTab"
              class="md:hidden rounded-md border border-[#cddfc9] bg-white px-2.5 py-1 text-xs font-medium text-[#173b2b]"
            >
              <option v-for="t in tabs" :key="t" :value="t">{{ t }}</option>
            </select>

            <div class="hidden sm:block">
              <h1 class="text-sm font-bold text-[#173b2b] tracking-tight">{{ activeTab }} Management</h1>
              <p class="text-[11px] text-[#6b856f]">Balezaf Biherawi Content &amp; Catalogue Studio</p>
            </div>
          </div>

          <div class="flex items-center gap-2.5">
            <NuxtLink
              to="/"
              class="inline-flex items-center gap-1 rounded-md border border-[#cddfc9] bg-white px-3 py-1 text-xs font-medium text-[#173b2b] transition hover:bg-[#edf5e9]"
            >
              <span>Live Site</span>
              <span class="text-[10px] text-gray-500">↗</span>
            </NuxtLink>
            <div class="flex h-7 w-7 items-center justify-center rounded-md bg-[#dcebd8] text-[11px] font-bold text-[#173b2b]">
              AD
            </div>
          </div>
        </header>

        <!-- Tab Content Body (Standard Padding & Scale) -->
        <div class="flex-1 p-4 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
          <!-- ============================================== -->
          <!-- 1. PRODUCTS TAB (Standard Table / Dense Grid)  -->
          <!-- ============================================== -->
          <div v-if="activeTab === 'Products'" class="space-y-3.5">
            <!-- Toolbar -->
            <div class="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-[#dce8d7] bg-white p-3.5 shadow-2xs">
              <div class="flex items-center gap-3 flex-1 min-w-[200px]">
                <div class="relative w-full max-w-xs">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search spirit name, category..."
                    class="admin-input !py-1 text-xs pl-8"
                  />
                  <svg class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span class="text-xs text-[#6e8a72] whitespace-nowrap">
                  {{ filteredProducts.length }} spirits
                </span>
              </div>

              <!-- Action Controls -->
              <div class="flex flex-wrap items-center gap-2">
                <!-- Table / Grid View Toggle -->
                <div class="flex items-center rounded-md border border-[#cddfc9] bg-[#f8faf6] p-0.5">
                  <button
                    type="button"
                    class="rounded px-2.5 py-1 text-xs font-medium transition"
                    :class="viewMode === 'table' ? 'bg-white text-[#173b2b] shadow-2xs font-semibold' : 'text-[#6e8a72] hover:text-[#173b2b]'"
                    @click="viewMode = 'table'"
                    title="Compact Table View"
                  >
                    Table
                  </button>
                  <button
                    type="button"
                    class="rounded px-2.5 py-1 text-xs font-medium transition"
                    :class="viewMode === 'grid' ? 'bg-white text-[#173b2b] shadow-2xs font-semibold' : 'text-[#6e8a72] hover:text-[#173b2b]'"
                    @click="viewMode = 'grid'"
                    title="Grid View"
                  >
                    Grid
                  </button>
                </div>

                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-md border border-[#cddfc9] bg-white px-2.5 py-1 text-xs font-medium text-[#173b2b] transition hover:bg-[#edf5e9]"
                  title="Export products.json file"
                  @click="downloadJsonFile"
                >
                  <svg class="h-3.5 w-3.5 text-[#35653c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export JSON</span>
                </button>

                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-md border border-[#cddfc9] bg-white px-2.5 py-1 text-xs font-medium text-[#173b2b] transition hover:bg-[#edf5e9]"
                  title="Import JSON into catalogue"
                  @click="showImportModal = true"
                >
                  <svg class="h-3.5 w-3.5 text-[#35653c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Import JSON</span>
                </button>

                <button
                  type="button"
                  class="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-500 hover:bg-gray-100"
                  title="Reset to products.json default factory data"
                  @click="handleResetDefaults"
                >
                  Reset Factory
                </button>

                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-md bg-[#173b2b] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#2b593a]"
                  @click="openProductAddModal"
                >
                  <span>+ Create Product</span>
                </button>
              </div>
            </div>

            <!-- Standard Compact Table View (Default: All fits on 1 screen) -->
            <div v-if="viewMode === 'table'" class="overflow-hidden rounded-xl border border-[#dce8d7] bg-white shadow-2xs">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="border-b border-[#e5efe2] bg-[#f8faf6] text-[11px] font-semibold uppercase tracking-wider text-[#547959]">
                      <th class="py-2.5 pl-4 pr-2 w-12 text-center">Bottle</th>
                      <th class="py-2.5 px-3">Product Name</th>
                      <th class="py-2.5 px-3">Category</th>
                      <th class="py-2.5 px-3">ABV / Vol</th>
                      <th class="py-2.5 px-3">Home Top 3</th>
                      <th class="py-2.5 px-3 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#edf3eb]">
                    <tr
                      v-for="prod in filteredProducts"
                      :key="prod.id"
                      class="hover:bg-[#fbfdfa] transition-colors"
                    >
                      <!-- Bottle Thumbnail -->
                      <td class="py-1.5 pl-4 pr-2 text-center">
                        <div class="mx-auto flex h-10 w-9 items-center justify-center rounded bg-[#f5f8f3] p-1">
                          <img
                            :src="prod.image"
                            :alt="prod.name"
                            class="max-h-8 w-auto object-contain"
                          />
                        </div>
                      </td>

                      <!-- Name & Tasting summary -->
                      <td class="py-2 px-3">
                        <div class="font-semibold text-[#173b2b]">{{ prod.name }}</div>
                        <div class="text-[11px] text-[#69846d] line-clamp-1 max-w-sm">
                          {{ prod.note || prod.tagline }}
                        </div>
                      </td>

                      <!-- Category -->
                      <td class="py-2 px-3">
                        <span class="inline-block rounded px-2 py-0.5 text-[11px] font-medium" :class="prod.badge || 'bg-gray-100 text-gray-700'">
                          {{ prod.category }}
                        </span>
                      </td>

                      <!-- ABV & Volume -->
                      <td class="py-2 px-3 text-[#526f57] whitespace-nowrap">
                        {{ prod.abv }} · {{ prod.volume }}
                      </td>

                      <!-- Home Page Flagship Toggle -->
                      <td class="py-2 px-3">
                        <button
                          type="button"
                          class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition"
                          :class="prod.isTopFlagship ? 'bg-[#faeedd] text-[#844d11] font-semibold border border-[#e6c79a]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                          :title="prod.isTopFlagship ? 'Featured in Home Page top 3' : 'Click to toggle Home Page feature'"
                          @click="toggleFlagship(prod)"
                        >
                          <span>{{ prod.isTopFlagship ? '★ Featured' : '☆ Standard' }}</span>
                        </button>
                      </td>

                      <!-- Actions -->
                      <td class="py-2 px-3 pr-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          class="rounded-md border border-[#cddfc9] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#173b2b] transition hover:bg-[#edf5e9]"
                          @click="openProductEditModal(prod)"
                        >
                          Edit ✎
                        </button>
                        <button
                          type="button"
                          class="rounded-md px-2 py-1 text-[11px] text-red-600 transition hover:bg-red-50 hover:text-red-800"
                          title="Delete product"
                          @click="removeProduct(prod.id, prod.name)"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Compact Grid View (Alternative) -->
            <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div
                v-for="prod in filteredProducts"
                :key="prod.id"
                class="flex flex-col justify-between rounded-xl border border-[#dce8d7] bg-white p-3.5 shadow-2xs hover:border-[#8ebb84] transition"
              >
                <div>
                  <div class="flex items-center justify-between">
                    <span class="rounded px-2 py-0.5 text-[10px] font-semibold" :class="prod.badge || 'bg-gray-100 text-gray-700'">
                      {{ prod.category }}
                    </span>
                    <button
                      type="button"
                      class="text-[10px] font-medium px-1.5 py-0.5 rounded transition"
                      :class="prod.isTopFlagship ? 'bg-[#faeedd] text-[#844d11] font-semibold' : 'text-gray-400 hover:text-gray-700'"
                      @click="toggleFlagship(prod)"
                    >
                      {{ prod.isTopFlagship ? '★ Top 3' : '☆ Standard' }}
                    </button>
                  </div>

                  <div class="my-2 flex h-24 items-center justify-center rounded-lg bg-[#f8faf6] p-2">
                    <img
                      :src="prod.image"
                      :alt="prod.name"
                      class="h-20 w-auto object-contain drop-shadow-sm"
                    />
                  </div>

                  <h3 class="font-semibold text-xs text-[#173b2b]">{{ prod.name }}</h3>
                  <p class="text-[11px] text-[#6b856f]">{{ prod.abv }} · {{ prod.volume }}</p>
                  <p class="mt-1 line-clamp-2 text-[11px] text-[#55715a] leading-tight">
                    {{ prod.note }}
                  </p>
                </div>

                <div class="mt-3 flex items-center justify-between border-t border-[#edf2ea] pt-2 text-[11px]">
                  <button
                    type="button"
                    class="font-semibold text-[#173b2b] hover:text-[#35653c]"
                    @click="openProductEditModal(prod)"
                  >
                    Edit ✎
                  </button>
                  <button
                    type="button"
                    class="text-red-600 hover:text-red-800"
                    @click="removeProduct(prod.id, prod.name)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- 2. OVERVIEW TAB (Standard Metrics Dashboard)   -->
          <!-- ============================================== -->
          <div v-else-if="activeTab === 'Overview'" class="space-y-4">
            <!-- 4 Metric Cards in 1 Row -->
            <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div class="rounded-xl border border-[#dce8d7] bg-white p-4 shadow-2xs">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#6e8a72]">Spirits Catalogue</span>
                <div class="mt-1 flex items-baseline justify-between">
                  <strong class="font-serif text-2xl font-bold text-[#173b2b]">{{ products.length }}</strong>
                  <button class="text-[11px] font-semibold text-[#35653c] hover:underline" @click="activeTab = 'Products'">
                    View →
                  </button>
                </div>
              </div>

              <div class="rounded-xl border border-[#dce8d7] bg-white p-4 shadow-2xs">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#6e8a72]">Published Events</span>
                <div class="mt-1 flex items-baseline justify-between">
                  <strong class="font-serif text-2xl font-bold text-[#173b2b]">{{ events.length }}</strong>
                  <button class="text-[11px] font-semibold text-[#35653c] hover:underline" @click="activeTab = 'Events'">
                    View →
                  </button>
                </div>
              </div>

              <div class="rounded-xl border border-[#dce8d7] bg-white p-4 shadow-2xs">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#6e8a72]">Journal Stories</span>
                <div class="mt-1 flex items-baseline justify-between">
                  <strong class="font-serif text-2xl font-bold text-[#173b2b]">{{ blogPosts.length }}</strong>
                  <button class="text-[11px] font-semibold text-[#35653c] hover:underline" @click="activeTab = 'Blog posts'">
                    View →
                  </button>
                </div>
              </div>

              <div class="rounded-xl border border-[#dce8d7] bg-white p-4 shadow-2xs">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#6e8a72]">Open Careers</span>
                <div class="mt-1 flex items-baseline justify-between">
                  <strong class="font-serif text-2xl font-bold text-[#173b2b]">{{ jobVacancies.length }}</strong>
                  <button class="text-[11px] font-semibold text-[#35653c] hover:underline" @click="activeTab = 'Job vacancies'">
                    View →
                  </button>
                </div>
              </div>
            </div>

            <!-- Quick Creation Bar -->
            <div class="rounded-xl border border-[#dce8d7] bg-white p-4 shadow-2xs">
              <h2 class="text-xs font-bold uppercase tracking-wider text-[#547959]">Quick Creation Modals</h2>
              <p class="mt-0.5 text-xs text-[#6e8a72]">Create items directly without leaving the dashboard:</p>

              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  class="rounded-md bg-[#173b2b] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#2b593a]"
                  @click="openProductAddModal"
                >
                  + New Product
                </button>
                <button
                  type="button"
                  class="rounded-md border border-[#cddfc9] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#173b2b] hover:bg-[#edf5e9]"
                  @click="openEventCreateModal"
                >
                  + New Event
                </button>
                <button
                  type="button"
                  class="rounded-md border border-[#cddfc9] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#173b2b] hover:bg-[#edf5e9]"
                  @click="openBlogCreateModal"
                >
                  + New Story
                </button>
                <button
                  type="button"
                  class="rounded-md border border-[#cddfc9] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#173b2b] hover:bg-[#edf5e9]"
                  @click="openJobCreateModal"
                >
                  + New Vacancy
                </button>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- 3. EVENTS TAB (Standard Compact Data List)     -->
          <!-- ============================================== -->
          <div v-else-if="activeTab === 'Events'" class="space-y-3.5">
            <div class="flex items-center justify-between rounded-xl border border-[#dce8d7] bg-white p-3.5 shadow-2xs">
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider text-[#547959]">Events &amp; Tastings</h2>
                <p class="text-[11px] text-[#6e8a72]">Manage upcoming tastings, cultural dinners, and masterclasses.</p>
              </div>
              <button
                type="button"
                class="rounded-md bg-[#173b2b] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2b593a]"
                @click="openEventCreateModal"
              >
                + Create Event
              </button>
            </div>

            <div class="overflow-hidden rounded-xl border border-[#dce8d7] bg-white shadow-2xs">
              <div class="divide-y divide-[#edf3eb]">
                <div
                  v-for="evt in events"
                  :key="evt.id"
                  class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-[#fbfdfa] transition gap-2"
                >
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="rounded bg-[#edf4eb] px-2 py-0.5 text-[10px] font-semibold text-[#285736]">
                        {{ evt.date }}
                      </span>
                      <span class="text-[11px] text-[#6d8a71]">· {{ evt.place }}</span>
                      <span class="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                        {{ evt.status }}
                      </span>
                    </div>
                    <h3 class="mt-1 font-semibold text-xs text-[#173b2b]">{{ evt.title }}</h3>
                    <p class="mt-0.5 text-[11px] text-[#55715a] line-clamp-1">{{ evt.text }}</p>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      class="rounded-md border border-[#cddfc9] bg-white px-2.5 py-1 text-xs font-semibold text-[#173b2b] hover:bg-[#edf5e9]"
                      @click="openEventEditModal(evt)"
                    >
                      Edit ✎
                    </button>
                    <button
                      type="button"
                      class="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      @click="removeEvent(evt.id, evt.title)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- 4. BLOG POSTS TAB (Standard Compact Data List) -->
          <!-- ============================================== -->
          <div v-else-if="activeTab === 'Blog posts'" class="space-y-3.5">
            <div class="flex items-center justify-between rounded-xl border border-[#dce8d7] bg-white p-3.5 shadow-2xs">
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider text-[#547959]">Journal Stories</h2>
                <p class="text-[11px] text-[#6e8a72]">Distillery news, heritage stories, and serve notes.</p>
              </div>
              <button
                type="button"
                class="rounded-md bg-[#173b2b] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2b593a]"
                @click="openBlogCreateModal"
              >
                + Create Story
              </button>
            </div>

            <div class="overflow-hidden rounded-xl border border-[#dce8d7] bg-white shadow-2xs">
              <div class="divide-y divide-[#edf3eb]">
                <div
                  v-for="post in blogPosts"
                  :key="post.id"
                  class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-[#fbfdfa] transition gap-2"
                >
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="rounded bg-[#edf4eb] px-2 py-0.5 text-[10px] font-semibold text-[#285736]">
                        {{ post.category }}
                      </span>
                      <span class="text-[11px] text-[#6d8a71]">· {{ post.date }}</span>
                      <span class="text-[11px] text-[#6d8a71]">· {{ post.author }}</span>
                    </div>
                    <h3 class="mt-1 font-semibold text-xs text-[#173b2b]">{{ post.title }}</h3>
                    <p class="mt-0.5 text-[11px] text-[#55715a] line-clamp-1">{{ post.text }}</p>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      class="rounded-md border border-[#cddfc9] bg-white px-2.5 py-1 text-xs font-semibold text-[#173b2b] hover:bg-[#edf5e9]"
                      @click="openBlogEditModal(post)"
                    >
                      Edit ✎
                    </button>
                    <button
                      type="button"
                      class="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      @click="removeBlogPost(post.id, post.title)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- 5. JOB VACANCIES TAB (Standard Compact Data List)-->
          <!-- ============================================== -->
          <div v-else-if="activeTab === 'Job vacancies'" class="space-y-3.5">
            <div class="flex items-center justify-between rounded-xl border border-[#dce8d7] bg-white p-3.5 shadow-2xs">
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider text-[#547959]">Careers &amp; Vacancies</h2>
                <p class="text-[11px] text-[#6e8a72]">Open positions across distillation, commercial, and administration.</p>
              </div>
              <button
                type="button"
                class="rounded-md bg-[#173b2b] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2b593a]"
                @click="openJobCreateModal"
              >
                + Post Vacancy
              </button>
            </div>

            <div class="overflow-hidden rounded-xl border border-[#dce8d7] bg-white shadow-2xs">
              <div class="divide-y divide-[#edf3eb]">
                <div
                  v-for="job in jobVacancies"
                  :key="job.id"
                  class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-[#fbfdfa] transition gap-2"
                >
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="rounded bg-[#edf4eb] px-2 py-0.5 text-[10px] font-semibold text-[#285736]">
                        {{ job.type }}
                      </span>
                      <span class="text-[11px] text-[#6d8a71]">· {{ job.team }}</span>
                      <span
                        class="rounded px-1.5 py-0.5 text-[9px] font-bold"
                        :class="job.status === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'"
                      >
                        {{ job.status }}
                      </span>
                    </div>
                    <h3 class="mt-1 font-semibold text-xs text-[#173b2b]">{{ job.title }}</h3>
                    <p class="mt-0.5 text-[11px] text-[#55715a] line-clamp-1">{{ job.description }}</p>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      class="rounded-md border border-[#cddfc9] bg-white px-2.5 py-1 text-xs font-semibold text-[#173b2b] hover:bg-[#edf5e9]"
                      @click="openJobEditModal(job)"
                    >
                      Edit ✎
                    </button>
                    <button
                      type="button"
                      class="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      @click="removeJob(job.id, job.title)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- ============================================== -->
    <!-- STANDARD MODAL 1: PRODUCT CREATE / EDIT        -->
    <!-- Compact layout fitting without excessive scroll -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="isProductModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" @click="isProductModalOpen = false"></div>

        <div class="relative z-10 flex max-h-[88vh] w-full max-w-xl flex-col rounded-xl border border-[#cddfc9] bg-white text-[#173b2b] shadow-2xl overflow-hidden">
          <!-- Compact Header (Fixed) -->
          <div class="flex items-center justify-between border-b border-[#e5efe2] bg-[#f8faf6] px-5 py-3 shrink-0">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-[#547959]">Product Catalogue</p>
              <h2 class="text-sm font-bold text-[#173b2b]">
                {{ isNewProduct ? 'Create New Spirit' : `Edit: ${productForm.name}` }}
              </h2>
            </div>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-xs"
              @click="isProductModalOpen = false"
            >
              ✕
            </button>
          </div>

          <!-- Body (Scrollable only if screen is tiny) -->
          <form class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 text-xs" @submit.prevent="saveProductChanges">
            <!-- Row 1: Name & Category -->
            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Spirit Name *</label>
                <input v-model="productForm.name" required class="admin-input" placeholder="e.g. Desta Dry Gin" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Category *</label>
                <input v-model="productForm.category" required class="admin-input" placeholder="e.g. London Dry Gin" />
              </div>
            </div>

            <!-- Row 2: ABV, Volume, Image Model -->
            <div class="grid gap-3 sm:grid-cols-3">
              <div>
                <label class="block text-[11px] font-semibold text-[#284f37] mb-1">ABV (%) *</label>
                <input v-model="productForm.abv" required class="admin-input" placeholder="e.g. 40% Vol." />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Volume *</label>
                <input v-model="productForm.volume" required class="admin-input" placeholder="e.g. 750ml" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Bottle Image</label>
                <div class="flex items-center gap-1.5">
                  <select v-model="productForm.imageKey" class="admin-input flex-1">
                    <option v-for="key in availableImageKeys" :key="key" :value="key">
                      {{ key.toUpperCase() }}
                    </option>
                  </select>
                  <div class="flex h-8 w-7 items-center justify-center rounded border border-[#cddfc9] bg-[#f8faf6] shrink-0 p-0.5">
                    <img :src="resolveBottleImage(productForm.imageKey)" alt="Preview" class="max-h-7 max-w-full object-contain" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 3: Description -->
            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Card Note / Description *</label>
              <textarea
                v-model="productForm.note"
                required
                rows="2"
                class="admin-input resize-y"
                placeholder="Distinctive tasting summary for catalogue cards..."
              ></textarea>
            </div>

            <!-- Tasting Profile (Compact 2x2 Grid) -->
            <div class="rounded-lg border border-[#dce8d7] bg-[#f8faf6] p-3 space-y-2">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-[#3e6f47]">
                Tasting Specs (Shown in Details Modal)
              </span>

              <div class="grid gap-2.5 sm:grid-cols-2">
                <div>
                  <label class="block text-[10px] font-medium text-[#284f37] mb-0.5">Aroma (Nose)</label>
                  <input v-model="productForm.aroma" class="admin-input !py-1 text-xs" placeholder="Wild juniper, fresh lime..." />
                </div>
                <div>
                  <label class="block text-[10px] font-medium text-[#284f37] mb-0.5">Palate (Taste)</label>
                  <input v-model="productForm.palate" class="admin-input !py-1 text-xs" placeholder="Zesty citrus, herbal pine..." />
                </div>
              </div>

              <div class="grid gap-2.5 sm:grid-cols-2">
                <div>
                  <label class="block text-[10px] font-medium text-[#284f37] mb-0.5">Finish</label>
                  <input v-model="productForm.finish" class="admin-input !py-1 text-xs" placeholder="Crisp, lingering dry finish..." />
                </div>
                <div>
                  <label class="block text-[10px] font-medium text-[#284f37] mb-0.5">Perfect Serve</label>
                  <input v-model="productForm.serving" class="admin-input !py-1 text-xs" placeholder="Serve over ice with tonic..." />
                </div>
              </div>
            </div>

            <!-- Flagship Checkbox -->
            <div class="flex items-center gap-2 rounded-lg border border-[#e5efe2] bg-[#f8faf6] px-3 py-2">
              <input
                id="flagship_toggle"
                v-model="productForm.isTopFlagship"
                type="checkbox"
                class="h-3.5 w-3.5 rounded border-gray-300 text-[#173b2b] focus:ring-[#35653c]"
              />
              <label for="flagship_toggle" class="cursor-pointer select-none text-[11px] font-semibold text-[#173b2b]">
                Feature as one of Top 3 Flagships on Home Page
              </label>
            </div>

            <!-- Hidden submit button to allow Enter key to submit form -->
            <button type="submit" class="hidden"></button>
          </form>

          <!-- Compact Footer (Fixed) -->
          <div class="flex items-center justify-end gap-2 border-t border-[#e5efe2] bg-[#f8faf6] px-5 py-2.5 shrink-0">
            <button
              type="button"
              class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
              @click="isProductModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="rounded-md bg-[#173b2b] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#2b593a]"
              @click="saveProductChanges"
            >
              {{ isNewProduct ? 'Create Product' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- STANDARD MODAL 2: EVENT CREATE / EDIT          -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="isEventModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" @click="isEventModalOpen = false"></div>

        <div class="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col rounded-xl border border-[#cddfc9] bg-white text-[#173b2b] shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between border-b border-[#e5efe2] bg-[#f8faf6] px-5 py-3 shrink-0">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-[#547959]">Events Studio</p>
              <h2 class="text-sm font-bold text-[#173b2b]">
                {{ isNewEvent ? 'Create Event' : 'Edit Event' }}
              </h2>
            </div>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-xs"
              @click="isEventModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 text-xs" @submit.prevent="saveEventChanges">
            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Event Title *</label>
              <input v-model="eventForm.title" required class="admin-input" placeholder="e.g. Balezaf Tasting Table" />
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Date *</label>
                <input v-model="eventForm.date" required class="admin-input" placeholder="e.g. 18 May 2026" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Status</label>
                <select v-model="eventForm.status" class="admin-input">
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Location / Venue *</label>
              <input v-model="eventForm.place" required class="admin-input" placeholder="e.g. Balezaf House · Addis Ababa" />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Event Description *</label>
              <textarea
                v-model="eventForm.text"
                required
                rows="3"
                class="admin-input resize-y"
                placeholder="What can guests expect at this gathering?"
              ></textarea>
            </div>
          </form>

          <div class="flex items-center justify-end gap-2 border-t border-[#e5efe2] bg-[#f8faf6] px-5 py-2.5 shrink-0">
            <button
              type="button"
              class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
              @click="isEventModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="rounded-md bg-[#173b2b] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#2b593a]"
              @click="saveEventChanges"
            >
              {{ isNewEvent ? 'Create Event' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- STANDARD MODAL 3: BLOG POST CREATE / EDIT      -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="isBlogModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" @click="isBlogModalOpen = false"></div>

        <div class="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col rounded-xl border border-[#cddfc9] bg-white text-[#173b2b] shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between border-b border-[#e5efe2] bg-[#f8faf6] px-5 py-3 shrink-0">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-[#547959]">Journal Studio</p>
              <h2 class="text-sm font-bold text-[#173b2b]">
                {{ isNewBlog ? 'Create Story' : 'Edit Story' }}
              </h2>
            </div>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-xs"
              @click="isBlogModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 text-xs" @submit.prevent="saveBlogChanges">
            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Story Title *</label>
              <input v-model="blogForm.title" required class="admin-input" placeholder="e.g. Highland Botanicals..." />
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Category</label>
                <select v-model="blogForm.category" class="admin-input">
                  <option value="MAKING BALEZAF">MAKING BALEZAF</option>
                  <option value="SERVE NOTES">SERVE NOTES</option>
                  <option value="PEOPLE &amp; PLACE">PEOPLE &amp; PLACE</option>
                  <option value="HERITAGE">HERITAGE</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Author</label>
                <input v-model="blogForm.author" required class="admin-input" placeholder="e.g. Master Distiller" />
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Publication Date *</label>
              <input v-model="blogForm.date" required class="admin-input" placeholder="e.g. 12 April 2026" />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Story Excerpt / Content *</label>
              <textarea
                v-model="blogForm.text"
                required
                rows="3"
                class="admin-input resize-y"
                placeholder="Write the summary or article content..."
              ></textarea>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Cover Image URL (optional)</label>
              <input v-model="blogForm.image" class="admin-input" placeholder="https://..." />
            </div>
          </form>

          <div class="flex items-center justify-end gap-2 border-t border-[#e5efe2] bg-[#f8faf6] px-5 py-2.5 shrink-0">
            <button
              type="button"
              class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
              @click="isBlogModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="rounded-md bg-[#173b2b] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#2b593a]"
              @click="saveBlogChanges"
            >
              {{ isNewBlog ? 'Publish Story' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- STANDARD MODAL 4: JOB VACANCY CREATE / EDIT    -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="isJobModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" @click="isJobModalOpen = false"></div>

        <div class="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col rounded-xl border border-[#cddfc9] bg-white text-[#173b2b] shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between border-b border-[#e5efe2] bg-[#f8faf6] px-5 py-3 shrink-0">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-[#547959]">Careers Studio</p>
              <h2 class="text-sm font-bold text-[#173b2b]">
                {{ isNewJob ? 'Post Vacancy' : 'Edit Vacancy' }}
              </h2>
            </div>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-xs"
              @click="isJobModalOpen = false"
            >
              ✕
            </button>
          </div>

          <form class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 text-xs" @submit.prevent="saveJobChanges">
            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Role Title *</label>
              <input v-model="jobForm.title" required class="admin-input" placeholder="e.g. Brand & Partnerships Manager" />
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Team &amp; Location *</label>
                <input v-model="jobForm.team" required class="admin-input" placeholder="e.g. Commercial · Addis Ababa" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Type</label>
                <select v-model="jobForm.type" class="admin-input">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Role Overview / Description *</label>
              <textarea
                v-model="jobForm.description"
                required
                rows="3"
                class="admin-input resize-y"
                placeholder="Key responsibilities and qualifications..."
              ></textarea>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Status</label>
              <select v-model="jobForm.status" class="admin-input">
                <option value="Open">Open</option>
                <option value="Closed / Filled">Closed / Filled</option>
              </select>
            </div>
          </form>

          <div class="flex items-center justify-end gap-2 border-t border-[#e5efe2] bg-[#f8faf6] px-5 py-2.5 shrink-0">
            <button
              type="button"
              class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
              @click="isJobModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="rounded-md bg-[#173b2b] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#2b593a]"
              @click="saveJobChanges"
            >
              {{ isNewJob ? 'Post Vacancy' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- STANDARD MODAL 5: IMPORT PRODUCTS JSON         -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="showImportModal"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" @click="showImportModal = false"></div>

        <div class="relative z-10 w-full max-w-md rounded-xl border border-[#cddfc9] bg-white text-[#173b2b] shadow-2xl p-5">
          <div class="flex items-center justify-between border-b border-[#e5efe2] pb-2.5">
            <h3 class="text-sm font-bold text-[#173b2b]">Import Products JSON</h3>
            <button
              type="button"
              class="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-xs"
              @click="showImportModal = false"
            >
              ✕
            </button>
          </div>

          <div class="mt-3.5 space-y-3 text-xs">
            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Upload products.json file:</label>
              <input
                type="file"
                accept=".json,application/json"
                class="block w-full text-xs text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-[#173b2b] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#2b593a]"
                @change="handleFileUpload"
              />
            </div>

            <div class="relative flex items-center py-0.5">
              <div class="flex-grow border-t border-gray-200"></div>
              <span class="mx-2 shrink text-[10px] text-gray-400 uppercase tracking-wider">or paste JSON</span>
              <div class="flex-grow border-t border-gray-200"></div>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Paste JSON Array:</label>
              <textarea
                v-model="importJsonText"
                rows="4"
                class="admin-input font-mono text-[11px]"
                placeholder='[ { "id": "gin", "name": "Desta Dry Gin", ... } ]'
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                @click="showImportModal = false"
              >
                Cancel
              </button>
              <button
                type="button"
                class="rounded-md bg-[#173b2b] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2b593a]"
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

<style scoped>
.admin-input {
  display: block;
  width: 100%;
  border: 1px solid #d4e2d0;
  border-radius: 0.375rem;
  background-color: #ffffff;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: #173b2b;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.admin-input:focus {
  border-color: #3b7447;
  box-shadow: 0 0 0 2px rgba(59, 116, 71, 0.15);
}
</style>
