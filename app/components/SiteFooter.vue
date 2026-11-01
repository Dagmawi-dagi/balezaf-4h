<template>
  <footer class="bg-[#102e21] px-6 py-10 text-[#c8ddc4] lg:px-10">
    <div class="mx-auto grid max-w-7xl gap-10 border-b border-white/15 pb-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div class="flex flex-col justify-between gap-7">
        <div>
          <NuxtLink to="/" class="text-lg font-semibold tracking-[0.18em] text-white">DESTA</NuxtLink>
          <p class="mt-2 max-w-xs text-sm text-[#a8c0a5]">Crafted in Ethiopia. Shared everywhere.</p>
        </div>
        <div class="flex flex-wrap gap-6 text-sm">
          <NuxtLink to="/events" class="hover:text-white">Events</NuxtLink>
          <NuxtLink to="/blog" class="hover:text-white">Journal</NuxtLink>
          <NuxtLink to="/careers" class="hover:text-white">Careers</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-white">Contact</NuxtLink>
        </div>
      </div>
      <div class="overflow-hidden rounded-2xl border border-white/15 bg-[#dfead9]">
        <iframe title="Desta Alcohol & Liquor Factory location map" src="https://www.openstreetmap.org/export/embed.html?bbox=38.70%2C8.93%2C38.82%2C9.08&amp;layer=mapnik&amp;marker=9.00%2C38.76" class="h-48 w-full border-0" loading="lazy"></iframe>
      </div>
    </div>
    <div class="mx-auto max-w-7xl pt-6 text-xs text-[#8daa8c]">© 2026 Desta Alcohol &amp; Liquor Factory PLC · Please enjoy responsibly.</div>
  </footer>
</template>
