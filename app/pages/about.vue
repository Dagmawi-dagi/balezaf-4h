<template>
  <div class="min-h-screen bg-[#fffdf9] text-[#173b2b]">
    <SiteHeader />
    <main>
      <section class="bg-[#173b2b] px-6 py-20 text-white lg:px-10 lg:py-28">
        <div class="mx-auto max-w-7xl">
          <p class="eyebrow text-[#b8d7af]">About Desta</p>
          <h1 class="mt-5 max-w-4xl font-serif text-5xl leading-tight sm:text-7xl">Rooted in place. Made for <em class="font-normal text-[#b8d7af]">connection.</em></h1>
          <p class="mt-7 max-w-2xl text-lg leading-8 text-[#d8e7d4]">We are an Ethiopian alcohol and liquor factory creating thoughtful spirits that bring people, ingredients, and stories together.</p>
        </div>
      </section>
      <section class="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-32">
        <div><p class="eyebrow">Our identity</p><h2 class="mt-5 max-w-md font-serif text-4xl leading-tight sm:text-5xl">A modern spirit with a <em class="text-[#65975d]">local accent.</em></h2></div>
        <div class="max-w-2xl text-lg leading-9 text-[#355944]"><p>Desta was built around a simple idea: great spirits should feel generous, distinctive, and connected to where they come from. We combine careful production with Ethiopian character, making bottles that feel at home in both everyday moments and special celebrations.</p><p class="mt-7">Our team is committed to responsible craft, consistent quality, and creating opportunities for the people and communities around us.</p></div>
      </section>
      <section class="bg-[#f1f6ed] px-6 py-20 lg:px-10 lg:py-28"><div class="mx-auto max-w-7xl"><p class="eyebrow">What guides us</p><div class="mt-10 grid gap-5 md:grid-cols-3"><article v-for="item in [{ title: 'Make with care', text: 'From sourcing to bottling, we believe the details are worth doing well.' }, { title: 'Share generously', text: 'Our spirits are made to open conversations and make room for everyone.' }, { title: 'Grow responsibly', text: 'We build for the long term, with respect for our people, place, and planet.' }]" :key="item.title" class="rounded-3xl bg-white p-7"><span class="text-2xl text-[#65975d]">✦</span><h3 class="mt-10 font-serif text-2xl">{{ item.title }}</h3><p class="mt-4 leading-7 text-[#66816b]">{{ item.text }}</p></article></div></div></section>
      <section class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28"><div class="rounded-3xl bg-[#173b2b] p-8 text-white sm:p-12"><p class="eyebrow text-[#b8d7af]">Come meet us</p><div class="mt-4 flex flex-col justify-between gap-8 sm:flex-row sm:items-end"><h2 class="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">The best stories are better when they are <em class="font-normal text-[#b8d7af]">shared.</em></h2><NuxtLink to="/#contact" class="shrink-0 rounded-full bg-[#c6dfbc] px-6 py-3 text-sm font-semibold text-[#173b2b]">Start a conversation ↗</NuxtLink></div></div></section>
    </main>
    <SiteFooter />
  </div>
</template>
