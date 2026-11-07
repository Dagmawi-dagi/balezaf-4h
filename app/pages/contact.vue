<script setup lang="ts">
import { ref } from 'vue'

const inquirySent = ref(false)

const submitInquiry = async (FormD: any, form$: any) => {
  try {
    inquirySent.value = true
    frontEndErrorFeedback().success('Thanks! Your inquiry has been received.')
  } catch (error) {
    frontEndErrorFeedback().err(error)
  }
}
</script>

<template>
  <main class="min-h-screen bg-[#fffdf9] text-[#183b2a]">
    <SiteHeader />
    <section id="contact" class="px-6 pb-12 pt-32 lg:px-10">
      <div class="mx-auto max-w-7xl">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#6d9b6b]">Get in touch</p>
        <h1 class="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-[#183b2a] sm:text-7xl">Come visit the source.</h1>

        <div class="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div class="rounded-3xl bg-[#f1f6ed] p-8 sm:p-10">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d9b6b]">Balezaf Alcohol & Liquor Factory PLC</p>
            <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#183b2a]">Let's talk</h2>
            <p class="mt-4 max-w-md leading-7 text-[#587361]">Bring a little more spirit to the table. For wholesale orders, partnerships, or product questions, our team would love to hear from you.</p>
            <div class="mt-8 space-y-4 text-sm text-[#587361]">
              <p><span class="mr-2 text-[#6d9b6b]">✦</span>Addis Ababa, Ethiopia</p>
              <p><span class="mr-2 text-[#6d9b6b]">✦</span>+251 914 300 007</p>
              <p><span class="mr-2 text-[#6d9b6b]">✦</span>destaalcohol@gmail.com</p>
            </div>
            <div class="mt-8 border-t border-[#d9e6d5] pt-6">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d9b6b]">Hours</p>
              <p class="mt-3 text-sm text-[#587361]">Monday–Friday, 8:30–17:30</p>
            </div>
          </div>

          <div class="rounded-3xl border border-[#d9e6d5] bg-white p-7 shadow-[0_18px_45px_rgba(24,59,42,0.08)] sm:p-10">
            <div v-if="inquirySent" class="mb-6 rounded-xl border border-[#b8d7af] bg-[#f1f6ed] p-4 text-sm text-[#35653c]">
              Thanks — your inquiry has been received. We'll be in touch soon.
            </div>
            <ClientOnly>
              <Vueform :endpoint="submitInquiry">
                <TextElement
                  name="name"
                  label="Name"
                  placeholder="Your name"
                  :columns="{ container: 6 }"
                  :rules="['required']"
                />
                <TextElement
                  name="email"
                  input-type="email"
                  label="Email"
                  placeholder="you@company.com"
                  :columns="{ container: 6 }"
                  :rules="['required', 'email']"
                />
                <TextareaElement
                  name="message"
                  label="How can we help?"
                  placeholder="Tell us about your order or partnership"
                  :rows="4"
                  :rules="['required']"
                />
                <ButtonElement
                  name="submit"
                  button-label="Send inquiry ↗"
                  :submits="true"
                />
              </Vueform>
            </ClientOnly>
          </div>
        </div>

        <div class="mt-8 overflow-hidden rounded-[2rem] border border-[#d9e6d5] bg-[#dfead9] shadow-[0_18px_45px_rgba(24,59,42,0.1)]">
          <iframe title="Map showing Balezaf Alcohol & Liquor Factory in Addis Ababa, Ethiopia" src="https://www.openstreetmap.org/export/embed.html?bbox=38.70%2C8.93%2C38.82%2C9.08&amp;layer=mapnik&amp;marker=9.00%2C38.76" class="h-[420px] w-full border-0 sm:h-[520px]" loading="lazy"></iframe>
        </div>
      </div>
    </section>
    <SiteFooter />
  </main>
</template>
