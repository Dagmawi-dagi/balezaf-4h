<script setup lang="ts">
const form = reactive({
  area: 'Local',
  product: '',
  quantity: '',
  name: '',
  company: '',
  email: '',
  phone: '',
  message: '',
})

function submitOrder() {
  const subject = encodeURIComponent(`Order inquiry from ${form.name || 'website visitor'}`)
  const body = encodeURIComponent([
    `Order area: ${form.area}`,
    `Product: ${form.product}`,
    `Quantity: ${form.quantity}`,
    `Name: ${form.name}`,
    `Company: ${form.company || 'N/A'}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    '',
    form.message,
  ].join('\n'))

  window.location.href = `mailto:destaalcohol@gmail.com?subject=${subject}&body=${body}`
}
</script>

<template>
  <div class="min-h-screen bg-[#fffdf9] text-[#173b2b]">
    <SiteHeader />

    <main>
      <section class="bg-[#dcebd7] px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-36">
        <div class="mx-auto max-w-6xl">
          <p class="eyebrow">Wholesale & distribution</p>
          <h1 class="mt-4 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.04em] text-[#173b2b] sm:text-6xl lg:text-8xl">
            Place an order with Balezaf.
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-7 text-[#315a43] sm:text-lg">
            Tell us what you need and our team will follow up with availability, pricing, and delivery details.
          </p>
        </div>
      </section>

      <section class="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p class="eyebrow">Order form</p>
            <h2 class="mt-3 font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">Let&apos;s talk about your order.</h2>
            <p class="mt-5 max-w-md text-sm leading-6 text-[#53705c] sm:text-base">
              For local or export orders, complete the form and your email client will prepare a message for our sales team.
            </p>
            <div class="mt-8 border-t border-[#d7e1d2] pt-6 text-sm leading-7 text-[#315a43]">
              <p>Orders & partnerships</p>
              <a class="block font-semibold text-[#17633a] hover:underline" href="mailto:destaalcohol@gmail.com">destaalcohol@gmail.com</a>
              <a class="block hover:text-[#17633a]" href="tel:+251914300007">+251 914 300 007</a>
            </div>
          </div>

          <form class="rounded-3xl bg-[#f1f5ed] p-6 sm:p-8 lg:p-10" @submit.prevent="submitOrder">
            <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Order area">
              <button v-for="area in ['Local', 'Export']" :key="area" type="button" class="rounded-full border px-5 py-2 text-sm font-semibold transition-colors" :class="form.area === area ? 'border-[#17633a] bg-[#17633a] text-white' : 'border-[#b8cdb5] text-[#315a43] hover:border-[#17633a]'" @click="form.area = area">
                {{ area }}
              </button>
            </div>

            <div class="mt-8 grid gap-5 sm:grid-cols-2">
              <label class="field-label sm:col-span-2">Product
                <select v-model="form.product" class="field-input" required>
                  <option value="" disabled>Select a product</option>
                  <option>Tej</option>
                  <option>Areki</option>
                  <option>Gin</option>
                  <option>Whisky</option>
                  <option>Other product</option>
                </select>
              </label>
              <label class="field-label">Quantity / volume
                <input v-model="form.quantity" class="field-input" type="text" placeholder="e.g. 50 cases" required />
              </label>
              <label class="field-label">Your name
                <input v-model="form.name" class="field-input" type="text" autocomplete="name" required />
              </label>
              <label class="field-label">Company
                <input v-model="form.company" class="field-input" type="text" autocomplete="organization" />
              </label>
              <label class="field-label">Email
                <input v-model="form.email" class="field-input" type="email" autocomplete="email" required />
              </label>
              <label class="field-label">Phone
                <input v-model="form.phone" class="field-input" type="tel" autocomplete="tel" required />
              </label>
              <label class="field-label sm:col-span-2">Order details
                <textarea v-model="form.message" class="field-input min-h-32 resize-y" placeholder="Tell us about delivery, timing, or any other requirements." required />
              </label>
            </div>

            <button class="mt-7 w-full rounded-full bg-[#17633a] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#0f4d2b]" type="submit">
              Prepare order email
            </button>
          </form>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
