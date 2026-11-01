<script setup lang="ts">
const posts = [
  { kind: 'Blog', category: 'MAKING BALEZAF', title: 'The botanicals that make our gin unmistakably Ethiopian', date: '12 April 2026', image: '', text: 'From bright citrus to fragrant herbs, explore the local ingredients that shape our signature profile.' },
  { kind: 'Blog', category: 'SERVE NOTES', title: 'A better highball starts with patience', date: '28 March 2026', image: '', text: 'A simple ritual for a fresh, balanced serve that lets every note in the bottle breathe.' },
  { kind: 'Blog', category: 'PEOPLE & PLACE', title: 'Inside the new generation of Addis hospitality', date: '04 February 2026', image: '', text: 'The bartenders, chefs, and hosts building a more generous drinks culture in Ethiopia.' },
]

const events = [
  { kind: 'Event', category: 'UPCOMING EVENT', title: 'Balezaf Tasting Table', date: '18 May 2026', image: '', place: 'Balezaf House · Addis Ababa', text: 'An intimate evening exploring our newest botanical spirits and seasonal serves.' },
  { kind: 'Event', category: 'UPCOMING EVENT', title: 'Taste of Ethiopia', date: '06 June 2026', image: '', place: 'Millennium Hall · Addis Ababa', text: 'Meet our makers and discover the ingredients behind Ethiopia’s modern spirit.' },
  { kind: 'Event', category: 'UPCOMING EVENT', title: 'Craft & Culture', date: '24 July 2026', image: '', place: 'The Skylight Garden · Addis Ababa', text: 'A creative gathering pairing local food, music, and considered cocktails.' },
]

const journalItems = [...posts, ...events]
const fallbackImage = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balezaf_blog_bg_green-VvU1YVwjlyPHJV2gYJlczTbYJ6iLwp.png'
const selectedPost = ref<(typeof journalItems)[number] | null>(null)

function openPost(post: (typeof journalItems)[number]) {
  selectedPost.value = post
}

function closePost() {
  selectedPost.value = null
}
</script>

<template>
  <div class="min-h-screen bg-[#fffdf9] text-[#173b2b]">
    <SiteHeader />
    <main>
      <section class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <p class="eyebrow">The Desta journal / Upcoming events</p>
        <h1 class="mt-5 max-w-3xl font-serif text-5xl leading-tight sm:text-7xl">Stories worth <em class="font-normal text-[#65975d]">savouring.</em></h1>
        <p class="mt-6 max-w-xl text-lg leading-8 text-[#66816b]">Notes from our distillery, our people, and the places where our bottles find their way.</p>

        <div class="mt-16 grid gap-x-7 gap-y-12 md:grid-cols-3">
          <article v-for="item in journalItems" :key="item.title" class="flex h-full flex-col overflow-hidden rounded-3xl bg-[#f1f6ee]">
            <div
              class="flex h-52 w-full items-end rounded-none bg-gradient-to-br from-[#dcebd7] via-[#93b889] to-[#35653c] bg-cover bg-center p-6"
              :style="{ backgroundImage: `url(${item.image || fallbackImage})` }"
            >
              <span class="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-[.18em] text-[#173b2b]">{{ item.kind }}</span>
            </div>
            <div class="flex flex-1 flex-col p-6">
              <p class="text-sm font-semibold text-[#65975d]">{{ item.date }}</p>
              <h2 class="mt-2 font-serif text-3xl leading-tight">{{ item.title }}</h2>
              <p v-if="item.kind === 'Event'" class="mt-4 text-sm font-semibold text-[#496a51]">{{ item.place }}</p>
              <p class="mt-4 leading-7 text-[#66816b]">{{ item.text }}</p>
              <button class="mt-auto pt-5 text-left text-sm font-semibold text-[#4f8a56] transition-colors hover:text-[#173b2b]" type="button" @click="openPost(item)">Read More <span aria-hidden="true">→</span></button>
            </div>
          </article>
        </div>
      </section>
    </main>
    <SiteFooter />

    <div v-if="selectedPost" class="fixed inset-0 z-[60] flex items-center justify-center bg-[#173b2b]/70 p-4" role="presentation" @click.self="closePost">
      <article class="blog-modal-scroll relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#fffdf9] text-[#173b2b] shadow-2xl" role="dialog" aria-modal="true" :aria-labelledby="`post-${selectedPost.title}`">
        <button class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0e4] text-xl text-[#173b2b]" type="button" aria-label="Close story" @click="closePost">×</button>
        <div
          class="h-48 rounded-none bg-gradient-to-br from-[#dcebd7] via-[#93b889] to-[#35653c] bg-cover bg-center sm:h-60"
          :style="{ backgroundImage: `url(${selectedPost.image || fallbackImage})` }"
          role="img"
          :aria-label="`${selectedPost.title} image`"
        />
        <div class="p-7 sm:p-10">
          <div class="flex flex-wrap items-center gap-3 pr-12">
            <span class="rounded-full bg-[#dcebd7] px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#35653c]">{{ selectedPost.kind }}</span>
            <span class="eyebrow">{{ selectedPost.category }}</span>
          </div>
        <h2 :id="`post-${selectedPost.title}`" class="mt-5 pr-8 font-serif text-4xl leading-tight sm:text-5xl">{{ selectedPost.title }}</h2>
        <p class="mt-5 text-sm text-[#779277]">{{ selectedPost.date }}</p>
        <p v-if="selectedPost.kind === 'Event'" class="mt-3 text-sm font-semibold text-[#496a51]">{{ selectedPost.place }}</p>
        <div class="mt-8 space-y-5 text-lg leading-8 text-[#496a51]"><p>{{ selectedPost.text }}</p><p>At Balezaf, every bottle begins with a deep respect for place. We work with bright local botanicals, careful craft, and the people who make Ethiopia’s drinks culture so full of character.</p><p>Pour a glass, take your time, and discover the story behind the spirit.</p></div>
        </div>
      </article>
    </div>
  </div>
</template>
