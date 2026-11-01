<script setup lang="ts">
const inquirySent = ref(false)
const inquiry = reactive({ name: '', email: '', message: '' })

function submitInquiry() {
  inquirySent.value = true
  inquiry.name = ''
  inquiry.email = ''
  inquiry.message = ''
}
</script>

<template>
  <main class="min-h-screen bg-[#fffdf9] text-[#183b2a]">
    <SiteHeader />
    <section id="contact" class="px-6 pb-12 pt-32 lg:px-10">
      <div class="mx-auto max-w-7xl">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#6d9b6b]">Get in touch</p>
        <h1 class="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-[#183b2a] sm:text-7xl">Come visit the source.</h1>
        <div class="mt-12 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div class="space-y-8">
            <div><h2 class="text-xl font-semibold">Desta Alcohol & Liquor Factory PLC</h2><p class="mt-3 text-[#587361]">Addis Ababa, Ethiopia</p></div>
            <div><p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d9b6b]">Contact</p><p class="mt-3 text-[#587361]">hello@destaalcohol.et<br />+251 11 000 0000</p></div>
            <div><p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d9b6b]">Hours</p><p class="mt-3 text-[#587361]">Monday–Friday, 8:30–17:30</p></div>
          </div>
          <div class="overflow-hidden rounded-[2rem] border border-[#d9e6d5] bg-[#dfead9] shadow-[0_18px_45px_rgba(24,59,42,0.1)]">
            <iframe title="Map showing Desta Alcohol & Liquor Factory in Addis Ababa, Ethiopia" src="https://www.openstreetmap.org/export/embed.html?bbox=38.70%2C8.93%2C38.82%2C9.08&amp;layer=mapnik&amp;marker=9.00%2C38.76" class="h-[360px] w-full border-0 sm:h-[430px]" loading="lazy"></iframe>
          </div>
        </div>

        <form class="mt-12 rounded-3xl bg-[#f1f6ed] p-7 sm:p-10" @submit.prevent="submitInquiry">
          <div v-if="inquirySent" class="mb-6 rounded-xl border border-[#b8d7af] bg-white p-4 text-sm text-[#35653c]">Thanks — your inquiry has been received. We&apos;ll be in touch soon.</div>
          <div class="grid gap-5 sm:grid-cols-2">
            <label class="text-sm font-medium">Name<input v-model="inquiry.name" required class="field" placeholder="Your name" /></label>
            <label class="text-sm font-medium">Email<input v-model="inquiry.email" required type="email" class="field" placeholder="you@company.com" /></label>
          </div>
          <label class="mt-5 block text-sm font-medium">How can we help?<textarea v-model="inquiry.message" required class="field min-h-32 resize-y" placeholder="Tell us about your order or partnership"></textarea></label>
          <button class="mt-6 rounded-full bg-[#173b2b] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#35653c]">Send inquiry <span aria-hidden="true">↗</span></button>
        </form>
      </div>
    </section>
    <SiteFooter />
  </main>
</template>
