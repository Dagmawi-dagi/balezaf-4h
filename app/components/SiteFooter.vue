<template>
  <footer class="overflow-hidden bg-[#102e21] px-4 py-10 text-[#c8ddc4] sm:px-6 lg:px-10">
    <div class="mx-auto grid max-w-7xl gap-10 border-b border-white/15 pb-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div class="flex flex-col justify-between gap-7">
        <div>
          <NuxtLink to="/" class="flex items-center gap-3 text-white" aria-label="Balezaf Alcohol Liquors Factory PLC home">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balezaf%20alcohol%20liquors%20factory%20plc%20LOGO-qsQOjEqqCnEubCgRx3GHDzu11GaPo2.png" alt="Balezaf Alcohol Liquors Factory PLC logo" class="h-12 w-12 rounded-full object-cover" />
            <span class="max-w-[240px] text-sm font-semibold uppercase tracking-[0.08em]">Balezaf Alcohol Liquors Factory PLC</span>
          </NuxtLink>
          <p class="mt-3 max-w-xs text-sm text-[#a8c0a5]">Crafted in Ethiopia. Shared everywhere.</p>
        </div>
        <div class="grid gap-8 sm:grid-cols-2">
          <div>
            <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9fc29a]">Explore</p>
            <div class="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <NuxtLink to="/products" class="hover:text-white">Products</NuxtLink>
              <NuxtLink to="/events" class="hover:text-white">Events</NuxtLink>
              <NuxtLink to="/blog" class="hover:text-white">Journal</NuxtLink>
              <NuxtLink to="/careers" class="hover:text-white">Careers</NuxtLink>
              <NuxtLink to="/contact" class="hover:text-white">Contact</NuxtLink>
            </div>
          </div>
          <div>
            <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9fc29a]">Products</p>
            <ul class="space-y-2 text-sm text-[#c8ddc4]"><li><NuxtLink to="/products" class="hover:text-white">Blue Nile Gin</NuxtLink></li><li><NuxtLink to="/products" class="hover:text-white">Desta Whisky</NuxtLink></li><li><NuxtLink to="/products" class="hover:text-white">Highland Vodka</NuxtLink></li><li><NuxtLink to="/products" class="hover:text-white">Abay Aperitif</NuxtLink></li></ul>
          </div>
        </div>
      </div>
      <div>
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9fc29a]">Find Balezaf in Addis Ababa</p>
        <div class="overflow-hidden rounded-2xl border border-white/15 bg-[#dfead9] shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          <iframe title="Balezaf Alcohol Liquors Factory PLC location map" src="https://www.openstreetmap.org/export/embed.html?bbox=38.70%2C8.93%2C38.82%2C9.08&amp;layer=mapnik&amp;marker=9.00%2C38.76" class="h-56 w-full border-0" loading="lazy"></iframe>
        </div>
      </div>
    </div>
    <div class="mx-auto max-w-7xl pt-6 text-xs text-[#8daa8c]">© 2026 Desta Alcohol &amp; Liquor Factory PLC · Please enjoy responsibly.</div>
  </footer>
</template>
