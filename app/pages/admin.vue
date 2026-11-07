<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { type ProductItem, resolveBottleImage, useProducts } from '~/composables/useProducts'
import { useAuth } from '~/composables/useAuth'

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

const { user, loading: authLoading, initialized: authInitialized, fetchUser, login, logout } = useAuth()

const loginForm = reactive({
  email: 'admin@balezaf.et',
  password: 'Admin@123456',
})
const loginError = ref('')
const isLoggingIn = ref(false)

async function handleAdminLogin() {
  loginError.value = ''
  isLoggingIn.value = true
  const res = await login(loginForm.email, loginForm.password)
  isLoggingIn.value = false
  if (!res.success) {
    loginError.value = res.error || 'Invalid credentials'
  } else {
    notify('Welcome back, Admin!')
    await fetchBackendData()
  }
}

async function handleAdminLoginVueform(FD: any, form$: any) {
  loginError.value = ''
  isLoggingIn.value = true
  const res = await login(form$.data.email, form$.data.password)
  isLoggingIn.value = false
  if (!res.success) {
    loginError.value = res.error || 'Invalid credentials'
    frontEndErrorFeedback().err(loginError.value)
  } else {
    frontEndErrorFeedback().success('Welcome back, Admin!')
    await fetchBackendData()
  }
}

async function handleAdminLogout() {
  await logout()
  notify('Signed out successfully.')
}

const activeTab = ref('Products')
const tabs = ['Products', 'Overview', 'Events', 'Blog posts', 'Job vacancies', 'Applications']
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

// Client-side image compression helper (max 960px width, 82% quality)
// Ensures uploaded photos load instantly and fit comfortably in localStorage
async function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).')
      return reject(new Error('Invalid image file type'))
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const maxWidth = 960
        const maxHeight = 720
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.82))
        } else {
          resolve(e.target?.result as string)
        }
      }
      img.onerror = () => resolve(e.target?.result as string)
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
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

const productFormValues = computed(() => ({
  name: productForm.name || '',
  category: productForm.category || '',
  abv: productForm.abv || '40% Vol.',
  volume: productForm.volume || '750ml',
  imageKey: productForm.imageKey || 'gin',
  note: productForm.note || '',
  aroma: productForm.aroma || '',
  palate: productForm.palate || '',
  finish: productForm.finish || '',
  serving: productForm.serving || 'Serve chilled over ice.',
  isTopFlagship: !!productForm.isTopFlagship,
}))

function saveProductChangesVueform(FD: any, form$: any) {
  const d = form$.data
  if (isNewProduct.value) {
    addProduct({
      ...productForm,
      name: d.name,
      category: d.category,
      abv: d.abv,
      volume: d.volume,
      imageKey: d.imageKey,
      note: d.note,
      aroma: d.aroma,
      palate: d.palate,
      finish: d.finish,
      serving: d.serving,
      isTopFlagship: !!d.isTopFlagship,
    })
    frontEndErrorFeedback().success(`Created "${d.name}"!`)
  } else if (editingProduct.value) {
    updateProduct(editingProduct.value.id, {
      ...productForm,
      name: d.name,
      category: d.category,
      abv: d.abv,
      volume: d.volume,
      imageKey: d.imageKey,
      note: d.note,
      aroma: d.aroma,
      palate: d.palate,
      finish: d.finish,
      serving: d.serving,
      isTopFlagship: !!d.isTopFlagship,
    })
    frontEndErrorFeedback().success(`Updated "${d.name}"!`)
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
// 2. EVENTS MANAGEMENT (With Image Upload)
// ----------------------------------------------------
interface EventItem {
  id: string
  title: string
  date: string
  place: string
  category: string
  text: string
  image?: string
  status: string
}

const events = ref<EventItem[]>([
  {
    id: 'evt-1',
    title: 'Desta Tasting Table',
    date: '18 May 2026',
    place: 'Desta House · Addis Ababa',
    category: 'UPCOMING EVENT',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balezaf_blog_bg_green-VvU1YVwjlyPHJV2gYJlczTbYJ6iLwp.png',
    text: 'An intimate evening exploring our newest botanical spirits and seasonal serves with our master distillers.',
    status: 'Published',
  },
  {
    id: 'evt-2',
    title: 'Taste of Ethiopia',
    date: '06 June 2026',
    place: 'Millennium Hall · Addis Ababa',
    category: 'UPCOMING EVENT',
    image: '',
    text: 'Meet our makers and discover the indigenous botanicals behind Ethiopia’s modern spirits.',
    status: 'Published',
  },
  {
    id: 'evt-3',
    title: 'Craft & Culture Gala',
    date: '24 July 2026',
    place: 'The Skylight Garden · Addis Ababa',
    category: 'UPCOMING EVENT',
    image: '',
    text: 'A creative gathering pairing local culinary craft, live music, and considered cocktail pairings.',
    status: 'Published',
  },
])

const isEventModalOpen = ref(false)
const isNewEvent = ref(false)
const editingEventId = ref<string | null>(null)
const eventFileInput = ref<HTMLInputElement | null>(null)
const isUploadingEventImg = ref(false)

const eventForm = reactive<EventItem>({
  id: '',
  title: '',
  date: '',
  place: '',
  category: 'UPCOMING EVENT',
  text: '',
  image: '',
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
    image: '',
    status: 'Published',
  })
  isEventModalOpen.value = true
}

function openEventEditModal(evt: EventItem) {
  isNewEvent.value = false
  editingEventId.value = evt.id
  Object.assign(eventForm, {
    ...evt,
    image: evt.image || '',
  })
  isEventModalOpen.value = true
}

async function handleEventImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  isUploadingEventImg.value = true
  try {
    const dataUrl = await processImageFile(file)
    eventForm.image = dataUrl
    notify('Event photo attached!')
  } catch (err) {
    console.error(err)
    alert('Failed to process uploaded image.')
  } finally {
    isUploadingEventImg.value = false
    if (eventFileInput.value) eventFileInput.value.value = ''
  }
}

function removeEventImage() {
  eventForm.image = ''
  if (eventFileInput.value) eventFileInput.value.value = ''
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

const eventFormValues = computed(() => ({
  title: eventForm.title || '',
  date: eventForm.date || '',
  status: eventForm.status || 'Published',
  place: eventForm.place || '',
}))

function saveEventChangesVueform(FD: any, form$: any) {
  const d = form$.data
  if (isNewEvent.value) {
    events.value.unshift({
      ...eventForm,
      title: d.title,
      date: d.date,
      status: d.status,
      place: d.place,
    })
    frontEndErrorFeedback().success(`Created event "${d.title}"!`)
  } else {
    const idx = events.value.findIndex((e) => e.id === editingEventId.value)
    if (idx !== -1) {
      events.value[idx] = {
        ...events.value[idx],
        ...eventForm,
        title: d.title,
        date: d.date,
        status: d.status,
        place: d.place,
      }
      frontEndErrorFeedback().success(`Updated event "${d.title}"!`)
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
// 3. BLOG POSTS MANAGEMENT (With Image Upload)
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
const blogFileInput = ref<HTMLInputElement | null>(null)
const isUploadingBlogImg = ref(false)

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
  Object.assign(blogForm, {
    ...post,
    image: post.image || '',
  })
  isBlogModalOpen.value = true
}

async function handleBlogImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  isUploadingBlogImg.value = true
  try {
    const dataUrl = await processImageFile(file)
    blogForm.image = dataUrl
    notify('Story cover photo attached!')
  } catch (err) {
    console.error(err)
    alert('Failed to process uploaded image.')
  } finally {
    isUploadingBlogImg.value = false
    if (blogFileInput.value) blogFileInput.value.value = ''
  }
}

function removeBlogImage() {
  blogForm.image = ''
  if (blogFileInput.value) blogFileInput.value.value = ''
}

async function saveBlogChanges() {
  if (!blogForm.title.trim()) return
  try {
    if (isNewBlog.value) {
      const res: any = await $fetch('/api/blogs', {
        method: 'POST',
        body: {
          title: blogForm.title,
          category: blogForm.category,
          content: blogForm.text,
          imageUrl: blogForm.image,
          isPublished: blogForm.status === 'Published',
        },
      })
      if (res && res.success) {
        notify(`Created story "${blogForm.title}"!`)
        await fetchBackendData()
        isBlogModalOpen.value = false
        return
      }
    } else {
      const res: any = await $fetch(`/api/blogs/${editingBlogId.value}`, {
        method: 'PUT',
        body: {
          title: blogForm.title,
          category: blogForm.category,
          content: blogForm.text,
          imageUrl: blogForm.image,
          isPublished: blogForm.status === 'Published',
        },
      })
      if (res && res.success) {
        notify(`Updated story "${blogForm.title}"!`)
        await fetchBackendData()
        isBlogModalOpen.value = false
        return
      }
    }
  } catch (err: any) {
    console.warn('API error when saving blog, falling back to local:', err)
  }

  // Fallback to local
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

async function removeBlogPost(id: string, title: string) {
  if (confirm(`Delete post "${title}"?`)) {
    try {
      await $fetch(`/api/blogs/${id}`, { method: 'DELETE' })
      notify(`Deleted post "${title}".`)
      await fetchBackendData()
      return
    } catch (err) {
      console.warn('API delete error, falling back to local:', err)
    }
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
  company: string
  locations: string
  deadline: string
  salary: string
  team: string
  type: string
  description: string
  requirements: string
  status: string
}

const jobVacancies = ref<JobItem[]>([])

const isJobModalOpen = ref(false)
const isNewJob = ref(false)
const editingJobId = ref<string | null>(null)

const jobForm = reactive<JobItem>({
  id: '',
  title: '',
  company: 'BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
  locations: 'Addis Ababa',
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  salary: 'based in the company scale',
  team: 'Distillery · Addis Ababa',
  type: 'Full-time',
  description: '',
  requirements: '',
  status: 'Open',
})

function openJobCreateModal() {
  isNewJob.value = true
  editingJobId.value = null
  Object.assign(jobForm, {
    id: 'job_' + Date.now().toString(36),
    title: '',
    company: 'BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
    locations: 'Addis Ababa',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    salary: 'based in the company scale',
    team: 'Operations · Addis Ababa',
    type: 'Full-time',
    description: '',
    requirements: '<p>Proven experience and dedicated work ethic.</p>',
    status: 'Open',
  })
  isJobModalOpen.value = true
}

function openJobEditModal(job: any) {
  isNewJob.value = false
  editingJobId.value = job.id
  Object.assign(jobForm, {
    ...job,
    company: job.company || 'BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
    locations: Array.isArray(job.locations) ? job.locations.join(', ') : (job.locations || 'Addis Ababa'),
    deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
    salary: job.salary || 'based in the company scale',
    requirements: job.requirements || '',
  })
  isJobModalOpen.value = true
}

const vacancyFormValues = computed(() => {
  if (isNewJob.value || !editingJobId.value) {
    return {
      position_name: '',
      company: 'BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
      salary: 'based in the company scale',
      locations: ['Addis Ababa'],
      description: '',
      requirements: '<p>Proven experience and dedicated work ethic.</p>',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  }
  const job = jobVacancies.value.find((j) => j.id === editingJobId.value) || jobForm
  const locs = Array.isArray(job.locations)
    ? job.locations
    : (typeof job.locations === 'string'
        ? job.locations.split(',').map((s: string) => s.trim()).filter(Boolean)
        : ['Addis Ababa'])

  return {
    position_name: job.title || (job as any).position_name || '',
    company: job.company || 'BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
    salary: job.salary || 'based in the company scale',
    locations: locs.length > 0 ? locs : ['Addis Ababa'],
    description: job.description || '',
    requirements: job.requirements || '',
    deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
  }
})

const postNewVacancy = async (FormD: any, form$: any) => {
  try {
    const isEdit = !isNewJob.value && editingJobId.value
    const url = isEdit ? `/api/vacancies/${editingJobId.value}` : '/api/vacancy'
    const method = isEdit ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: form$.data,
      headers: {
        apiref: '/api/vacancy/POST',
      },
    })
    frontEndErrorFeedback().success(isEdit ? 'Vacancy updated successfully' : 'New vacancy posted successfully')
    await fetchBackendData()
    isJobModalOpen.value = false
  } catch (error: any) {
    frontEndErrorFeedback().err(error)
  }
}

async function saveJobChanges() {
  if (!jobForm.title.trim()) return
  const locationsArray = jobForm.locations.split(',').map((l) => l.trim()).filter(Boolean)

  try {
    if (isNewJob.value) {
      const res: any = await $fetch('/api/vacancies', {
        method: 'POST',
        body: {
          title: jobForm.title,
          company: jobForm.company,
          locations: locationsArray,
          deadline: jobForm.deadline ? new Date(jobForm.deadline).toISOString() : null,
          salary: jobForm.salary,
          team: jobForm.team,
          type: jobForm.type,
          description: jobForm.description,
          requirements: jobForm.requirements,
          status: jobForm.status === 'Open' ? 'OPEN' : 'CLOSED',
        },
      })
      if (res && res.success) {
        notify(`Created vacancy "${jobForm.title}"!`)
        await fetchBackendData()
        isJobModalOpen.value = false
        return
      }
    } else {
      const res: any = await $fetch(`/api/vacancies/${editingJobId.value}`, {
        method: 'PUT',
        body: {
          title: jobForm.title,
          company: jobForm.company,
          locations: locationsArray,
          deadline: jobForm.deadline ? new Date(jobForm.deadline).toISOString() : null,
          salary: jobForm.salary,
          team: jobForm.team,
          type: jobForm.type,
          description: jobForm.description,
          requirements: jobForm.requirements,
          status: jobForm.status === 'Open' ? 'OPEN' : 'CLOSED',
        },
      })
      if (res && res.success) {
        notify(`Updated vacancy "${jobForm.title}"!`)
        await fetchBackendData()
        isJobModalOpen.value = false
        return
      }
    }
  } catch (err) {
    console.warn('API error saving vacancy, falling back to local:', err)
  }

  // Fallback
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

async function removeJob(id: string, title: string) {
  if (confirm(`Delete vacancy "${title}"?`)) {
    try {
      await $fetch(`/api/vacancies/${id}`, { method: 'DELETE' })
      notify(`Deleted vacancy "${title}".`)
      await fetchBackendData()
      return
    } catch (err) {
      console.warn('API error deleting vacancy, falling back to local:', err)
    }
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
// 5. APPLICATIONS MANAGEMENT
// ----------------------------------------------------
interface ApplicationItem {
  id: string
  vacancyId: string
  fullName: string
  email?: string
  phone?: string
  phoneNumber?: string
  gender?: string
  workExperience?: string
  languages?: string[]
  skills?: string[]
  workExperienceInformation?: any[]
  uploadedFiles?: string[]
  resumeUrl?: string
  coverLetter?: string
  status: string
  createdAt: string
  vacancy?: {
    id: string
    title: string
    team: string
    company?: string
  }
}

const applications = ref<ApplicationItem[]>([])
const selectedApp = ref<ApplicationItem | null>(null)
const appFilterStatus = ref('ALL')

const filteredApplications = computed(() => {
  if (appFilterStatus.value === 'ALL') return applications.value
  return applications.value.filter((a) => a.status === appFilterStatus.value)
})

async function updateApplicationStatus(id: string, newStatus: string) {
  try {
    await $fetch(`/api/applications/${id}/status`, {
      method: 'PATCH',
      body: { status: newStatus },
    })
    const app = applications.value.find((a) => a.id === id)
    if (app) app.status = newStatus
    notify(`Application status updated to ${newStatus}`)
  } catch (err: any) {
    alert(err?.data?.statusMessage || 'Failed to update status.')
  }
}

async function removeApplication(id: string, name: string) {
  if (confirm(`Remove application from "${name}"?`)) {
    try {
      await $fetch(`/api/applications/${id}`, { method: 'DELETE' })
      applications.value = applications.value.filter((a) => a.id !== id)
      if (selectedApp.value?.id === id) selectedApp.value = null
      notify(`Removed application for ${name}.`)
    } catch (err: any) {
      alert(err?.data?.statusMessage || 'Failed to delete application.')
    }
  }
}

// ----------------------------------------------------
// 6. BACKEND DATA SYNC
// ----------------------------------------------------
async function fetchBackendData() {
  try {
    // 1. Fetch live Blog posts
    const blogRes: any = await $fetch('/api/blogs?all=true')
    if (blogRes && blogRes.success && Array.isArray(blogRes.data)) {
      blogPosts.value = blogRes.data.map((b: any) => ({
        id: b.id,
        title: b.title,
        category: b.category,
        date: new Date(b.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        author: b.author?.fullName || 'Distillery Team',
        image: b.imageUrl || '',
        text: b.content || b.excerpt || '',
        status: b.isPublished ? 'Published' : 'Draft',
      }))
    }

    // 2. Fetch live Vacancies
    const vacRes: any = await $fetch('/api/vacancies?all=true')
    if (vacRes && vacRes.success && Array.isArray(vacRes.data)) {
      jobVacancies.value = vacRes.data.map((v: any) => ({
        id: v.id,
        title: v.title,
        company: v.company || 'BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
        locations: Array.isArray(v.locations) ? v.locations.join(', ') : (v.locations || 'Addis Ababa'),
        deadline: v.deadline ? new Date(v.deadline).toISOString().split('T')[0] : '',
        salary: v.salary || 'based in the company scale',
        team: v.team || 'Operations · Addis Ababa',
        type: v.type || 'Full-time',
        description: v.description,
        requirements: v.requirements || '',
        status: v.status === 'OPEN' ? 'Open' : 'Closed',
      }))
    }

    // 3. Fetch live Applications
    const appRes: any = await $fetch('/api/applications')
    if (appRes && appRes.success && Array.isArray(appRes.data)) {
      applications.value = appRes.data
    }
  } catch (err) {
    console.warn('Could not sync with backend API, using cached:', err)
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

// Hydrate and authenticate on mounted
onMounted(async () => {
  await fetchUser()
  if (user.value) {
    await fetchBackendData()
  }

  if (typeof window !== 'undefined') {
    try {
      const storedEvt = localStorage.getItem('balezaf_events')
      if (storedEvt) events.value = JSON.parse(storedEvt)
      const storedBlog = localStorage.getItem('balezaf_blog_posts')
      if (storedBlog && (!blogPosts.value || blogPosts.value.length === 0)) blogPosts.value = JSON.parse(storedBlog)
      const storedJobs = localStorage.getItem('balezaf_jobs')
      if (storedJobs && (!jobVacancies.value || jobVacancies.value.length === 0)) jobVacancies.value = JSON.parse(storedJobs)
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

    <!-- 1. Loading state -->
    <div v-if="!authInitialized" class="flex min-h-screen items-center justify-center">
      <div class="flex items-center gap-2 text-sm font-semibold text-[#173b2b]">
        <div class="h-4 w-4 animate-spin rounded-full border-2 border-[#35653c] border-t-transparent"></div>
        <span>Connecting to Balezaf Workspace...</span>
      </div>
    </div>

    <!-- 2. Authentication Login Screen -->
    <div v-else-if="!user" class="flex min-h-screen items-center justify-center bg-[#173b2b] p-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div class="text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#c6dfbc] font-serif text-xl font-bold text-[#173b2b]">
            B
          </div>
          <h1 class="mt-4 font-serif text-2xl font-bold text-[#173b2b]">Balezaf Portal</h1>
          <p class="mt-1 text-xs text-[#6e8a72]">Sign in with your administrative credentials</p>
        </div>

        <div v-if="loginError" class="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">
          {{ loginError }}
        </div>

        <div class="mt-6">
          <ClientOnly>
            <Vueform
              :endpoint="handleAdminLoginVueform"
              :default-values="{ email: 'admin@balezaf.et', password: 'Admin@123456' }"
            >
              <TextElement
                name="email"
                input-type="email"
                label="Email Address"
                placeholder="admin@balezaf.et"
                :rules="['required', 'email']"
              />
              <TextElement
                name="password"
                input-type="password"
                label="Password"
                placeholder="••••••••"
                :rules="['required']"
              />
              <ButtonElement
                name="submit"
                button-label="Sign In to Workspace"
                :submits="true"
                :full="true"
              />
            </Vueform>
          </ClientOnly>

          <p class="mt-4 text-center text-[11px] text-gray-400">
            Default credentials: <span class="font-mono text-[#173b2b]">admin@balezaf.et</span> / <span class="font-mono text-[#173b2b]">Admin@123456</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 3. Authenticated Admin Workspace -->
    <div v-else class="flex min-h-screen">
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
              <span
                v-else-if="tab === 'Applications'"
                class="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold"
              >
                {{ applications.length }}
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
            <div class="flex items-center gap-2">
              <div class="flex h-7 px-2.5 items-center justify-center rounded-md bg-[#dcebd8] text-[11px] font-bold text-[#173b2b]">
                {{ user?.fullName || 'Admin' }}
              </div>
              <button
                type="button"
                class="rounded-md border border-red-200 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 transition"
                @click="handleAdminLogout"
              >
                Sign Out
              </button>
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
                  title="Reset to default factory catalogue"
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

            <!-- Standard Compact Table View -->
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
                      <td class="py-1.5 pl-4 pr-2 text-center">
                        <div class="mx-auto flex h-10 w-9 items-center justify-center rounded bg-[#f5f8f3] p-1">
                          <img
                            :src="prod.image"
                            :alt="prod.name"
                            class="max-h-8 w-auto object-contain"
                          />
                        </div>
                      </td>

                      <td class="py-2 px-3">
                        <div class="font-semibold text-[#173b2b]">{{ prod.name }}</div>
                        <div class="text-[11px] text-[#69846d] line-clamp-1 max-w-sm">
                          {{ prod.note || prod.tagline }}
                        </div>
                      </td>

                      <td class="py-2 px-3">
                        <span class="inline-block rounded px-2 py-0.5 text-[11px] font-medium" :class="prod.badge || 'bg-gray-100 text-gray-700'">
                          {{ prod.category }}
                        </span>
                      </td>

                      <td class="py-2 px-3 text-[#526f57] whitespace-nowrap">
                        {{ prod.abv }} · {{ prod.volume }}
                      </td>

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

            <!-- Compact Grid View -->
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
          <!-- 3. EVENTS TAB (With Image Thumbnail & Upload)  -->
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
                  class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-[#fbfdfa] transition gap-3"
                >
                  <div class="flex items-start gap-3 min-w-0 flex-1">
                    <!-- Thumbnail preview if image attached -->
                    <div
                      v-if="evt.image"
                      class="h-12 w-14 shrink-0 rounded-md overflow-hidden border border-[#dce8d7] bg-[#f8faf6]"
                    >
                      <img :src="evt.image" :alt="evt.title" class="h-full w-full object-cover" />
                    </div>
                    <div
                      v-else
                      class="h-12 w-14 shrink-0 rounded-md flex items-center justify-center border border-[#dce8d7] bg-[#f8faf6] text-xs text-[#6e8a72]"
                    >
                      📅
                    </div>

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
                  </div>

                  <div class="flex items-center gap-2 shrink-0 sm:self-center">
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
          <!-- 4. BLOG POSTS TAB (With Image Thumbnail/Upload)-->
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
                  class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-[#fbfdfa] transition gap-3"
                >
                  <div class="flex items-start gap-3 min-w-0 flex-1">
                    <!-- Thumbnail preview if image attached -->
                    <div
                      v-if="post.image"
                      class="h-12 w-14 shrink-0 rounded-md overflow-hidden border border-[#dce8d7] bg-[#f8faf6]"
                    >
                      <img :src="post.image" :alt="post.title" class="h-full w-full object-cover" />
                    </div>
                    <div
                      v-else
                      class="h-12 w-14 shrink-0 rounded-md flex items-center justify-center border border-[#dce8d7] bg-[#f8faf6] text-xs text-[#6e8a72]"
                    >
                      📰
                    </div>

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
                  </div>

                  <div class="flex items-center gap-2 shrink-0 sm:self-center">
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
          <!-- 5. JOB VACANCIES TAB                           -->
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
                    <div class="mt-1 flex flex-wrap items-center gap-2.5 text-[10px] text-gray-500">
                      <span v-if="job.locations" class="inline-flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">📍 {{ job.locations }}</span>
                      <span v-if="job.deadline" class="inline-flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-800">⏳ Deadline: {{ job.deadline }}</span>
                      <span v-if="job.salary" class="inline-flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-800">💵 {{ job.salary }}</span>
                    </div>
                    <p class="mt-1.5 text-[11px] text-[#55715a] line-clamp-1">{{ job.description }}</p>
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

          <!-- ============================================== -->
          <!-- 6. APPLICATIONS TAB                           -->
          <!-- ============================================== -->
          <div v-else-if="activeTab === 'Applications'" class="space-y-3.5">
            <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dce8d7] bg-white p-3.5 shadow-2xs">
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider text-[#547959]">Candidate Applications</h2>
                <p class="text-[11px] text-[#6e8a72]">Review resumes and progress candidates through hiring stages.</p>
              </div>

              <!-- Filter by status -->
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-semibold text-[#547959]">Status:</span>
                <select v-model="appFilterStatus" class="admin-input !py-1 text-xs">
                  <option value="ALL">All Applications ({{ applications.length }})</option>
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWING">Reviewing</option>
                  <option value="INTERVIEWED">Interviewed</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div v-if="filteredApplications.length === 0" class="rounded-xl border border-[#dce8d7] bg-white p-12 text-center text-gray-500">
              <p class="font-medium">No applications found.</p>
              <p class="mt-1 text-xs text-gray-400">Applications submitted from the Careers page will appear here.</p>
            </div>

            <div v-else class="overflow-hidden rounded-xl border border-[#dce8d7] bg-white shadow-2xs">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                  <thead class="border-b border-[#e6efe3] bg-[#f9fbf8] text-[10px] font-bold uppercase tracking-wider text-[#55775b]">
                    <tr>
                      <th class="py-3 px-4">Applicant</th>
                      <th class="py-3 px-4">Position</th>
                      <th class="py-3 px-4">Applied Date</th>
                      <th class="py-3 px-4">Stage</th>
                      <th class="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#edf3eb]">
                    <tr v-for="app in filteredApplications" :key="app.id" class="hover:bg-[#fbfcfb]">
                      <td class="py-3 px-4">
                        <div class="font-semibold text-[#173b2b]">{{ app.fullName }}</div>
                        <div class="text-[11px] text-gray-500">{{ app.email }} · {{ app.phone || 'No phone' }}</div>
                      </td>
                      <td class="py-3 px-4">
                        <span class="font-medium text-[#2d5939]">{{ app.vacancy?.title || 'General / Unknown' }}</span>
                      </td>
                      <td class="py-3 px-4 text-gray-500 text-[11px]">
                        {{ new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}
                      </td>
                      <td class="py-3 px-4">
                        <select
                          :value="app.status"
                          @change="updateApplicationStatus(app.id, ($event.target as HTMLSelectElement).value)"
                          class="rounded-md border border-[#cddfc9] bg-white px-2 py-1 text-[11px] font-semibold"
                          :class="{
                            'text-amber-700 bg-amber-50': app.status === 'PENDING',
                            'text-blue-700 bg-blue-50': app.status === 'REVIEWING',
                            'text-purple-700 bg-purple-50': app.status === 'INTERVIEWED',
                            'text-emerald-700 bg-emerald-50': app.status === 'ACCEPTED',
                            'text-rose-700 bg-rose-50': app.status === 'REJECTED',
                          }"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="REVIEWING">REVIEWING</option>
                          <option value="INTERVIEWED">INTERVIEWED</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                      <td class="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          class="rounded border border-[#cddfc9] px-2.5 py-1 text-[11px] font-semibold text-[#173b2b] hover:bg-[#edf5e9]"
                          @click="selectedApp = app"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          class="rounded px-2 py-1 text-[11px] text-red-600 hover:bg-red-50"
                          @click="removeApplication(app.id, app.fullName)"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: APPLICATION DETAILS                     -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="selectedApp"
        class="fixed inset-0 z-[160] flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" @click="selectedApp = null"></div>
        <div class="relative z-10 w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-xl border border-[#cddfc9] bg-white p-6 shadow-2xl text-xs">
          <div class="flex items-start justify-between border-b border-[#edf3eb] pb-3">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-serif text-lg font-bold text-[#173b2b]">{{ selectedApp.fullName }}</h3>
                <span
                  v-if="selectedApp.gender"
                  class="rounded-full bg-[#f1f6ed] px-2 py-0.5 text-[10px] font-bold uppercase text-[#35653c]"
                >
                  {{ selectedApp.gender }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ selectedApp.email || 'No email' }} · {{ selectedApp.phone || selectedApp.phoneNumber || 'No phone' }}
              </p>
            </div>
            <button class="text-gray-400 hover:text-gray-600 text-sm font-bold" @click="selectedApp = null">✕</button>
          </div>

          <div class="mt-4 space-y-4">
            <div class="grid grid-cols-2 gap-3 bg-[#fcfdfb] p-3 rounded-lg border border-[#edf3eb]">
              <div>
                <span class="block text-[10px] font-bold uppercase text-[#547959]">Applied Role</span>
                <p class="text-xs font-semibold text-[#173b2b] mt-0.5">{{ selectedApp.vacancy?.title }}</p>
              </div>
              <div>
                <span class="block text-[10px] font-bold uppercase text-[#547959]">Work Experience</span>
                <p class="text-xs font-semibold text-[#173b2b] mt-0.5">{{ selectedApp.workExperience || 'Not specified' }}</p>
              </div>
            </div>

            <!-- Languages -->
            <div v-if="selectedApp.languages && selectedApp.languages.length > 0">
              <span class="block text-[10px] font-bold uppercase text-[#547959] mb-1.5">Languages</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="l in selectedApp.languages"
                  :key="l"
                  class="rounded-full bg-[#ebf4e8] px-2.5 py-0.5 text-[11px] font-semibold text-[#173b2b]"
                >
                  {{ l }}
                </span>
              </div>
            </div>

            <!-- Skills -->
            <div v-if="selectedApp.skills && selectedApp.skills.length > 0">
              <span class="block text-[10px] font-bold uppercase text-[#547959] mb-1.5">Skills</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="s in selectedApp.skills"
                  :key="s"
                  class="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-900"
                >
                  {{ s }}
                </span>
              </div>
            </div>

            <!-- Past Work Experience History -->
            <div v-if="selectedApp.workExperienceInformation && Array.isArray(selectedApp.workExperienceInformation) && selectedApp.workExperienceInformation.length > 0">
              <span class="block text-[10px] font-bold uppercase text-[#547959] mb-2">Previous Employment History</span>
              <div class="space-y-2.5">
                <div
                  v-for="(hist, hIdx) in selectedApp.workExperienceInformation"
                  :key="hIdx"
                  class="rounded-lg border border-[#e4ede1] bg-[#fafcf9] p-3 text-xs space-y-1.5"
                >
                  <div class="flex items-baseline justify-between font-bold text-[#173b2b]">
                    <span>{{ hist.position || 'Position' }}</span>
                    <span class="text-[11px] font-medium text-[#547959]">{{ hist.employerName || hist['company/employerName'] }}</span>
                  </div>
                  <p class="text-[11px] text-[#4d6a54] leading-relaxed">
                    {{ hist.dutiesDescription }}
                  </p>
                  <p v-if="hist.employerContact || hist['company/employerContact']" class="text-[10px] text-gray-500">
                    HR/Manager contact: {{ hist.employerContact || hist['company/employerContact'] }}
                  </p>
                </div>
              </div>
            </div>

            <!-- File Attachments / Resume -->
            <div v-if="(selectedApp.uploadedFiles && selectedApp.uploadedFiles.length > 0) || selectedApp.resumeUrl">
              <span class="block text-[10px] font-bold uppercase text-[#547959] mb-1.5">File Attachments / Resume</span>
              <div class="space-y-1">
                <a
                  v-if="selectedApp.resumeUrl"
                  :href="selectedApp.resumeUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-blue-600 underline font-semibold text-xs hover:text-blue-800"
                >
                  <span>Open Attached Link / Resume</span>
                  <span>↗</span>
                </a>
                <div
                  v-for="(fn, fIdx) in selectedApp.uploadedFiles"
                  :key="fIdx"
                  class="flex items-center gap-2 rounded bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-800"
                >
                  <span>📄</span>
                  <span class="font-medium truncate">{{ fn }}</span>
                </div>
              </div>
            </div>

            <!-- Cover Note -->
            <div v-if="selectedApp.coverLetter">
              <span class="block text-[10px] font-bold uppercase text-[#547959]">Cover Note / Remarks</span>
              <div class="mt-1 max-h-32 overflow-y-auto rounded-lg bg-gray-50 p-2.5 text-gray-700 whitespace-pre-line leading-relaxed">
                {{ selectedApp.coverLetter }}
              </div>
            </div>

            <!-- Stage Selector -->
            <div>
              <span class="block text-[10px] font-bold uppercase text-[#547959]">Hiring Pipeline Stage</span>
              <select
                :value="selectedApp.status"
                @change="updateApplicationStatus(selectedApp.id, ($event.target as HTMLSelectElement).value)"
                class="mt-1 rounded-md border border-[#cddfc9] bg-white px-2.5 py-1 text-xs font-semibold"
              >
                <option value="PENDING">PENDING</option>
                <option value="REVIEWING">REVIEWING</option>
                <option value="INTERVIEWED">INTERVIEWED</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-3">
            <button
              class="rounded-md bg-[#173b2b] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2b593a]"
              @click="selectedApp = null"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL 1: PRODUCT CREATE / EDIT                 -->
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

          <div class="flex-1 overflow-y-auto p-4 sm:p-5 text-xs">
            <ClientOnly>
              <Vueform :endpoint="saveProductChangesVueform" :default-values="productFormValues" :key="editingProduct?.id || 'new-prod'">
                <TextElement
                  name="name"
                  label="Spirit Name *"
                  placeholder="e.g. Desta Dry Gin"
                  :rules="['required']"
                  :columns="{ container: 6 }"
                />
                <TextElement
                  name="category"
                  label="Category *"
                  placeholder="e.g. London Dry Gin"
                  :rules="['required']"
                  :columns="{ container: 6 }"
                />
                <TextElement
                  name="abv"
                  label="ABV (%) *"
                  placeholder="e.g. 40% Vol."
                  :rules="['required']"
                  :columns="{ container: 4 }"
                />
                <TextElement
                  name="volume"
                  label="Volume *"
                  placeholder="e.g. 750ml"
                  :rules="['required']"
                  :columns="{ container: 4 }"
                />
                <SelectElement
                  name="imageKey"
                  label="Bottle Image"
                  :items="availableImageKeys.map(k => ({ value: k, label: k.toUpperCase() }))"
                  :columns="{ container: 4 }"
                />
                <TextareaElement
                  name="note"
                  label="Card Note / Description *"
                  placeholder="Distinctive tasting summary for catalogue cards..."
                  :rows="2"
                  :rules="['required']"
                />
                <StaticElement
                  name="tasting_heading"
                  tag="h4"
                  content="Tasting Specs"
                  size="sm"
                />
                <TextElement
                  name="aroma"
                  label="Aroma (Nose)"
                  placeholder="Wild juniper, fresh lime..."
                  :columns="{ container: 6 }"
                />
                <TextElement
                  name="palate"
                  label="Palate (Taste)"
                  placeholder="Zesty citrus, herbal pine..."
                  :columns="{ container: 6 }"
                />
                <TextElement
                  name="finish"
                  label="Finish"
                  placeholder="Crisp, lingering dry finish..."
                  :columns="{ container: 6 }"
                />
                <TextElement
                  name="serving"
                  label="Perfect Serve"
                  placeholder="Serve over ice with tonic..."
                  :columns="{ container: 6 }"
                />
                <CheckboxElement
                  name="isTopFlagship"
                  text="Feature as one of Top 3 Flagships on Home Page"
                />
                <ButtonElement
                  name="submit"
                  :button-label="isNewProduct ? 'Create Product' : 'Save Changes'"
                  :submits="true"
                  :full="true"
                />
              </Vueform>
            </ClientOnly>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL 2: EVENT CREATE / EDIT (IMAGE UPLOAD)    -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="isEventModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" @click="isEventModalOpen = false"></div>

        <div class="relative z-10 flex max-h-[88vh] w-full max-w-md flex-col rounded-xl border border-[#cddfc9] bg-white text-[#173b2b] shadow-2xl overflow-hidden">
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

          <div class="flex-1 overflow-y-auto p-4 sm:p-5 text-xs space-y-3">
            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Event Banner / Image</label>
              <div v-if="eventForm.image" class="mb-2 relative rounded-lg border border-[#cddfc9] overflow-hidden bg-[#f4f7f2]">
                <img :src="eventForm.image" alt="Event Preview" class="h-28 w-full object-cover" />
                <div class="absolute top-1.5 right-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    class="rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-black/80 transition"
                    @click="eventFileInput?.click()"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    class="rounded bg-red-600/80 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-red-700 transition"
                    @click="removeEventImage"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div v-else class="mb-2 flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-lg border border-dashed border-[#cddfc9] bg-[#f8faf6] px-3 py-2 text-xs font-medium text-[#284f37] hover:bg-[#edf5e9] transition flex items-center gap-1.5"
                  @click="eventFileInput?.click()"
                >
                  📷 Upload Banner Photo
                </button>
              </div>
              <input
                ref="eventFileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleEventImageUpload"
              />
            </div>

            <ClientOnly>
              <Vueform :endpoint="saveEventChangesVueform" :default-values="eventFormValues" :key="editingEventId || 'new-evt'">
                <TextElement
                  name="title"
                  label="Event Title *"
                  placeholder="e.g. Balezaf Tasting Table"
                  :rules="['required']"
                />
                <TextElement
                  name="date"
                  label="Date *"
                  placeholder="e.g. 18 May 2026"
                  :rules="['required']"
                  :columns="{ container: 6 }"
                />
                <SelectElement
                  name="status"
                  label="Status"
                  :items="['Published', 'Draft', 'Archived']"
                  :columns="{ container: 6 }"
                />
                <TextElement
                  name="place"
                  label="Location / Venue *"
                  placeholder="e.g. Balezaf House · Addis Ababa"
                  :rules="['required']"
                />
                <ButtonElement
                  name="submit"
                  :button-label="isNewEvent ? 'Publish Event' : 'Save Changes'"
                  :submits="true"
                  :full="true"
                />
              </Vueform>
            </ClientOnly>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL 3: BLOG POST CREATE / EDIT (IMAGE UPLOAD)-->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="isBlogModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" @click="isBlogModalOpen = false"></div>

        <div class="relative z-10 flex max-h-[88vh] w-full max-w-md flex-col rounded-xl border border-[#cddfc9] bg-white text-[#173b2b] shadow-2xl overflow-hidden">
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

          <div class="flex-1 overflow-y-auto p-4 sm:p-5 text-xs space-y-3">
            <div>
              <label class="block text-[11px] font-semibold text-[#284f37] mb-1">Story Cover Photo</label>
              <div v-if="blogForm.image" class="mb-2 relative rounded-lg border border-[#cddfc9] overflow-hidden bg-[#f4f7f2]">
                <img :src="blogForm.image" alt="Story Preview" class="h-28 w-full object-cover" />
                <div class="absolute top-1.5 right-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    class="rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-black/80 transition"
                    @click="blogFileInput?.click()"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    class="rounded bg-red-600/80 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-red-700 transition"
                    @click="removeBlogImage"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div v-else class="mb-2 flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-lg border border-dashed border-[#cddfc9] bg-[#f8faf6] px-3 py-2 text-xs font-medium text-[#284f37] hover:bg-[#edf5e9] transition flex items-center gap-1.5"
                  @click="blogFileInput?.click()"
                >
                  📷 Upload Cover Photo
                </button>
              </div>
              <input
                ref="blogFileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleBlogImageUpload"
              />
            </div>

            <ClientOnly>
              <Vueform :endpoint="saveBlogChangesVueform" :default-values="blogFormValues" :key="editingBlogId || 'new-blog'">
                <TextElement
                  name="title"
                  label="Story Title *"
                  placeholder="e.g. Highland Botanicals..."
                  :rules="['required']"
                />
                <SelectElement
                  name="category"
                  label="Category"
                  :items="['MAKING BALEZAF', 'SERVE NOTES', 'PEOPLE & PLACE', 'HERITAGE']"
                  :columns="{ container: 6 }"
                />
                <TextElement
                  name="author"
                  label="Author"
                  placeholder="e.g. Master Distiller"
                  :columns="{ container: 6 }"
                />
                <TextElement
                  name="date"
                  label="Publication Date *"
                  placeholder="e.g. 12 April 2026"
                  :rules="['required']"
                />
                <TextareaElement
                  name="text"
                  label="Story Content / Excerpt *"
                  placeholder="Write the journal story content here..."
                  :rows="4"
                  :rules="['required']"
                />
                <ButtonElement
                  name="submit"
                  :button-label="isNewBlog ? 'Publish Story' : 'Save Changes'"
                  :submits="true"
                  :full="true"
                />
              </Vueform>
            </ClientOnly>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL 4: JOB VACANCY CREATE / EDIT             -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div
        v-if="isJobModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" @click="isJobModalOpen = false"></div>

        <div class="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-[#cddfc9] bg-white text-[#173b2b] shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between border-b border-[#e5efe2] bg-[#f8faf6] px-5 py-3 shrink-0">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-[#547959]">Careers Studio</p>
              <h2 class="text-sm font-bold text-[#173b2b]">
                {{ isNewJob ? 'Post New Vacancy' : 'Edit Vacancy' }}
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

          <div class="flex-1 overflow-y-auto p-4 sm:p-6 text-xs">
            <ClientOnly>
              <Vueform :endpoint="postNewVacancy" :default-values="vacancyFormValues" :key="editingJobId || 'new'">
                <StaticElement
                  name="h3"
                  tag="h3"
                  :content="isNewJob ? 'Post New Vacancy' : 'Edit Vacancy'"
                  style="color: #1492E6;"
                  bottom="2"
                />
                <StaticElement
                  name="p"
                  tag="p"
                  content="<div>position name</div>"
                  :columns="{
                    container: 2,
                  }"
                />
                <TextElement
                  name="position_name"
                  :columns="{
                    container: 10,
                  }"
                  :rules="[
                    'required',
                  ]"
                />
                <StaticElement
                  name="p_1"
                  tag="p"
                  content="<div>company</div>"
                  :columns="{
                    container: 2,
                  }"
                />
                <TextElement
                  name="company"
                  :columns="{
                    container: 10,
                  }"
                  :rules="[
                    'required',
                  ]"
                />
                <StaticElement
                  name="p_3"
                  tag="p"
                  content="<div>salary</div>"
                  :columns="{
                    container: 2,
                  }"
                />
                <TextElement
                  name="salary"
                  :columns="{
                    container: 10,
                  }"
                  :rules="[
                    'required',
                  ]"
                />
                <StaticElement
                  name="p_2"
                  tag="p"
                  content="<div>location</div>"
                  :columns="{
                    container: 2,
                  }"
                />
                <TagsElement
                  name="locations"
                  :close-on-select="false"
                  :search="true"
                  :items="[
                    {
                      value: 'Addis Ababa',
                      label: 'Addis Ababa',
                    },
                    {
                      value: 'Hawassa',
                      label: 'Hawassa',
                    },
                    {
                      value: 'Bahir Dar',
                      label: 'Bahir Dar',
                    },
                    {
                      value: 'mekelle',
                      label: 'mekelle',
                    },
                    {
                      value: 'quiha',
                      label: 'quiha',
                    },
                    {
                      value: 'ayder',
                      label: 'ayder',
                    },
                  ]"
                  input-type="search"
                  autocomplete="off"
                  :columns="{
                    container: 10,
                  }"
                  :create="true"
                  :add-option-on="[
                    'enter',
                    ',',
                  ]"
                  :rules="[
                    'required',
                  ]"
                />
                <TextareaElement
                  name="description"
                  label="description"
                  :rules="[
                    'required',
                  ]"
                />
                <EditorElement
                  name="requirements"
                  label="requirements"
                  :rules="[
                    'required',
                  ]"
                />
                <DateElement
                  name="deadline"
                  label="deadline"
                  size="sm"
                  :rules="[
                    'required',
                  ]"
                  :columns="{
                    container: 4,
                  }"
                />
                <ButtonElement
                  name="post"
                  :button-label="isNewJob ? 'Post New Vacancy' : 'Save Changes'"
                  :submits="true"
                  align="center"
                  size="sm"
                  :columns="{
                    container: 10,
                  }"
                />
              </Vueform>
            </ClientOnly>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL 5: IMPORT PRODUCTS JSON                  -->
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
