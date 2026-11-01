<script setup lang="ts">
const contentTypes = [
  { key: 'blog', label: 'Blog post', eyebrow: 'Journal story' },
  { key: 'event', label: 'Event', eyebrow: 'Upcoming event' },
  { key: 'vacancy', label: 'Vacancy', eyebrow: 'Open role' },
] as const

type ContentType = (typeof contentTypes)[number]['key']

type ContentItem = {
  type: ContentType
  title: string
  category: string
  date: string
  location: string
  summary: string
}

const activeType = ref<ContentType>('blog')
const submittedItems = ref<ContentItem[]>([])
const form = reactive({
  title: '',
  category: '',
  date: '',
  location: '',
  summary: '',
})

const currentType = computed(() => contentTypes.find((item) => item.key === activeType.value) ?? contentTypes[0])

function selectType(type: ContentType) {
  activeType.value = type
  form.title = ''
  form.category = ''
  form.date = ''
  form.location = ''
  form.summary = ''
}

function publishContent() {
  submittedItems.value.unshift({ type: activeType.value, ...form })
  form.title = ''
  form.category = ''
  form.date = ''
  form.location = ''
  form.summary = ''
}
</script>

<template>
  <div class="min-h-screen bg-[#fffdf9] text-[#173b2b]">
    <SiteHeader />
    <main>
      <section class="bg-[#173b2b] px-6 py-16 text-white sm:py-20 lg:px-10">
        <div class="mx-auto max-w-7xl">
          <p class="eyebrow text-[#b8d7af]">Content studio</p>
          <div class="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 class="max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.04em] sm:text-7xl">Publish what&apos;s next.</h1>
              <p class="mt-5 max-w-xl text-base leading-7 text-[#d8e7d4]">Create journal stories, events, and open roles for the Balezaf site.</p>
            </div>
            <span class="rounded-full border border-[#65975d] px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-[#b8d7af]">Admin workspace</span>
          </div>
        </div>
      </section>

      <section class="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 lg:py-20">
        <aside>
          <p class="eyebrow">Create content</p>
          <h2 class="mt-3 font-serif text-4xl leading-tight">Choose a format.</h2>
          <div class="mt-7 space-y-3">
            <button v-for="type in contentTypes" :key="type.key" type="button" class="flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition" :class="activeType === type.key ? 'border-[#17633a] bg-[#17633a] text-white' : 'border-[#d7e1d2] bg-white text-[#315a43] hover:border-[#9fc495]'" @click="selectType(type.key)">
              <span>
                <span class="block text-sm font-semibold">{{ type.label }}</span>
                <span class="mt-1 block text-xs" :class="activeType === type.key ? 'text-[#d8e7d4]' : 'text-[#779277]'">{{ type.eyebrow }}</span>
              </span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <div class="mt-8 rounded-2xl bg-[#f1f5ed] p-5 text-sm leading-6 text-[#53705c]">
            <p class="font-semibold text-[#315a43]">Publishing note</p>
            <p class="mt-2">New entries are added to this workspace preview. A database or email integration is needed to make them permanent across deployments.</p>
          </div>
        </aside>

        <div class="rounded-3xl border border-[#d7e1d2] bg-white p-6 shadow-[0_12px_35px_rgba(23,59,43,0.06)] sm:p-9">
          <div class="flex items-start justify-between gap-4 border-b border-[#edf1e9] pb-6">
            <div>
              <p class="eyebrow">{{ currentType.eyebrow }}</p>
              <h2 class="mt-2 font-serif text-3xl">New {{ currentType.label.toLowerCase() }}</h2>
            </div>
            <span class="rounded-full bg-[#dcebd7] px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#35653c]">Draft</span>
          </div>

          <form class="mt-7 grid gap-5 sm:grid-cols-2" @submit.prevent="publishContent">
            <label class="field-label sm:col-span-2">Title
              <input v-model="form.title" class="field-input" type="text" placeholder="Give it a clear title" required />
            </label>
            <label class="field-label">Category
              <input v-model="form.category" class="field-input" type="text" :placeholder="activeType === 'vacancy' ? 'e.g. Distillery' : 'e.g. People & place'" required />
            </label>
            <label class="field-label">{{ activeType === 'vacancy' ? 'Closing date' : 'Publish date' }}
              <input v-model="form.date" class="field-input" type="date" required />
            </label>
            <label v-if="activeType !== 'blog'" class="field-label sm:col-span-2">{{ activeType === 'event' ? 'Location' : 'Team / workplace' }}
              <input v-model="form.location" class="field-input" type="text" :placeholder="activeType === 'event' ? 'Venue · City' : 'Team · Addis Ababa'" required />
            </label>
            <label class="field-label sm:col-span-2">Description
              <textarea v-model="form.summary" class="field-input min-h-40 resize-y" placeholder="Write the short description your audience will see." required />
            </label>
            <button class="sm:col-span-2 rounded-full bg-[#17633a] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#0f4d2b]" type="submit">Publish {{ currentType.label.toLowerCase() }} <span aria-hidden="true">↗</span></button>
          </form>
        </div>
      </section>

      <section v-if="submittedItems.length" class="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div class="border-t border-[#d7e1d2] pt-10">
          <p class="eyebrow">This session</p>
          <h2 class="mt-3 font-serif text-4xl">Published previews</h2>
          <div class="mt-7 grid gap-5 md:grid-cols-3">
            <article v-for="item in submittedItems" :key="`${item.title}-${item.date}`" class="rounded-2xl bg-[#f1f5ed] p-6">
              <span class="rounded-full bg-[#dcebd7] px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#35653c]">{{ item.type }}</span>
              <h3 class="mt-5 font-serif text-2xl leading-tight">{{ item.title }}</h3>
              <p class="mt-2 text-sm text-[#779277]">{{ item.date }}<span v-if="item.location"> · {{ item.location }}</span></p>
              <p class="mt-4 text-sm leading-6 text-[#53705c]">{{ item.summary }}</p>
            </article>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
