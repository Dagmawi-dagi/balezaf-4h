<script setup lang="ts">
const submitOrder = async (FormD: any, form$: any) => {
  const data = form$.data
  const subject = encodeURIComponent(`Order inquiry from ${data.name || 'website visitor'}`)
  const body = encodeURIComponent([
    `Order area: ${data.area || 'Local'}`,
    `Product: ${data.product || ''}`,
    `Quantity: ${data.quantity || ''}`,
    `Name: ${data.name || ''}`,
    `Company: ${data.company || 'N/A'}`,
    `Email: ${data.email || ''}`,
    `Phone: ${data.phone || ''}`,
    '',
    data.message || '',
  ].join('\n'))

  frontEndErrorFeedback().success('Opening your email client to dispatch order inquiry...')
  if (typeof window !== 'undefined') {
    window.location.href = `mailto:destaalcohol@gmail.com?subject=${subject}&body=${body}`
  }
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

          <div class="rounded-3xl bg-[#f1f5ed] p-6 sm:p-8 lg:p-10 shadow-sm">
            <ClientOnly>
              <Vueform :endpoint="submitOrder">
                <RadiogroupElement
                  name="area"
                  view="tabs"
                  :items="['Local', 'Export']"
                  default="Local"
                  size="sm"
                />
                <SelectElement
                  name="product"
                  label="Product"
                  :items="['Tej', 'Areki', 'Gin', 'Whisky', 'Vodka', 'Other product']"
                  placeholder="Select a product"
                  :rules="['required']"
                  :columns="{ container: 12 }"
                />
                <TextElement
                  name="quantity"
                  label="Quantity / volume"
                  placeholder="e.g. 50 cases"
                  :rules="['required']"
                  :columns="{ container: 6 }"
                />
                <TextElement
                  name="name"
                  label="Your name"
                  placeholder="Your full name"
                  :rules="['required']"
                  :columns="{ container: 6 }"
                />
                <TextElement
                  name="company"
                  label="Company"
                  placeholder="Your business or hotel name"
                  :columns="{ container: 6 }"
                />
                <TextElement
                  name="email"
                  input-type="email"
                  label="Email"
                  placeholder="you@company.com"
                  :rules="['required', 'email']"
                  :columns="{ container: 6 }"
                />
                <PhoneElement
                  name="phone"
                  label="Phone"
                  placeholder="+251 91 123 4567"
                  :allow-incomplete="true"
                  :unmask="true"
                  :rules="['required']"
                  :columns="{ container: 12 }"
                />
                <TextareaElement
                  name="message"
                  label="Order details"
                  placeholder="Tell us about delivery, timing, or any other requirements."
                  :rows="3"
                  :rules="['required']"
                  :columns="{ container: 12 }"
                />
                <ButtonElement
                  name="submit"
                  button-label="Prepare order email"
                  :submits="true"
                  :full="true"
                />
              </Vueform>
            </ClientOnly>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
