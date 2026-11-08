<script setup lang="ts">
import { onMounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'

const props = withDefaults(
  defineProps<{
    variant?: 'header' | 'topbar' | 'mobile' | 'footer'
  }>(),
  {
    variant: 'header',
  }
)

const { currentLocale, setLocale, toggleLocale, initLanguage } = useLanguage()

onMounted(() => {
  initLanguage()
})
</script>

<template>
  <!-- Variant: Header (sleek pill button with subtle green accent) -->
  <div v-if="variant === 'header'" class="inline-flex items-center">
    <div
      class="inline-flex items-center rounded-full border border-[#dfe9da] bg-[#f8faf6] p-1 text-xs shadow-2xs transition"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        :class="[
          'rounded-full px-2.5 py-1 font-semibold transition',
          currentLocale === 'en'
            ? 'bg-[#173b2b] text-white shadow-2xs'
            : 'text-[#55715a] hover:text-[#173b2b]'
        ]"
        aria-label="Switch to English"
        @click="setLocale('en')"
      >
        EN
      </button>

      <button
        type="button"
        :class="[
          'rounded-full px-2.5 py-1 font-semibold transition font-serif',
          currentLocale === 'am'
            ? 'bg-[#173b2b] text-white shadow-2xs'
            : 'text-[#55715a] hover:text-[#173b2b]'
        ]"
        aria-label="ወደ አማርኛ ቀይር (Switch to Amharic)"
        @click="setLocale('am')"
      >
        አማ
      </button>
    </div>
  </div>

  <!-- Variant: Top Bar (alongside social icons on the top utility nav) -->
  <div v-else-if="variant === 'topbar'" class="inline-flex items-center">
    <div
      class="inline-flex items-center rounded-full bg-white/10 p-0.5 text-xs font-semibold border border-white/20 shadow-xs backdrop-blur-xs"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        :class="[
          'rounded-full px-2 py-0.5 text-[11px] font-semibold transition tracking-wide',
          currentLocale === 'en'
            ? 'bg-[#b8d7af] text-[#173b2b] shadow-xs'
            : 'text-white/80 hover:text-white'
        ]"
        aria-label="Switch to English"
        @click="setLocale('en')"
      >
        EN
      </button>
      <button
        type="button"
        :class="[
          'rounded-full px-2 py-0.5 text-[11px] font-semibold transition font-serif',
          currentLocale === 'am'
            ? 'bg-[#b8d7af] text-[#173b2b] shadow-xs'
            : 'text-white/80 hover:text-white'
        ]"
        aria-label="ወደ አማርኛ ቀይር (Switch to Amharic)"
        @click="setLocale('am')"
      >
        አማ
      </button>
    </div>
  </div>

  <!-- Variant: Mobile Drawer -->
  <div v-else-if="variant === 'mobile'" class="flex items-center justify-between border-t border-white/15 pt-4 mt-2">
    <span class="text-xs uppercase tracking-wider text-[#b8d7af]">Language / ቋንቋ</span>
    <div class="inline-flex items-center rounded-full bg-white/10 p-1 text-xs border border-white/20">
      <button
        type="button"
        :class="[
          'rounded-full px-3 py-1 font-semibold transition',
          currentLocale === 'en' ? 'bg-white text-[#173b2b]' : 'text-white/80 hover:text-white'
        ]"
        @click="setLocale('en')"
      >
        English
      </button>
      <button
        type="button"
        :class="[
          'rounded-full px-3 py-1 font-semibold transition font-serif',
          currentLocale === 'am' ? 'bg-white text-[#173b2b]' : 'text-white/80 hover:text-white'
        ]"
        @click="setLocale('am')"
      >
        አማርኛ
      </button>
    </div>
  </div>

  <!-- Variant: Footer -->
  <div v-else class="space-y-2">
    <span class="block text-xs font-semibold uppercase tracking-wider text-[#9fc29a]">
      Language Preference / ቋንቋ ይምረጡ
    </span>
    <div class="inline-flex items-center rounded-full border border-white/20 bg-white/5 p-1 text-xs">
      <button
        type="button"
        :class="[
          'rounded-full px-3 py-1.5 transition font-medium',
          currentLocale === 'en' ? 'bg-[#81ab71] text-[#0d271c] font-bold shadow-xs' : 'text-[#c8ddc4] hover:text-white'
        ]"
        @click="setLocale('en')"
      >
        English (EN)
      </button>
      <button
        type="button"
        :class="[
          'rounded-full px-3 py-1.5 transition font-medium font-serif',
          currentLocale === 'am' ? 'bg-[#81ab71] text-[#0d271c] font-bold shadow-xs' : 'text-[#c8ddc4] hover:text-white'
        ]"
        @click="setLocale('am')"
      >
        አማርኛ (Amharic)
      </button>
    </div>
  </div>
</template>
