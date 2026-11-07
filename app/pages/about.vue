<script setup lang="ts">
import { ref } from 'vue'

useSeoMeta({
  title: 'About Balezaf Biherawi | Modern Distillation & Ethiopian Craft',
  description: 'Discover Balezaf Biherawi Alcohol & Liquor Factory: modern beverage engineering, sustainable distillation, Ethiopian highland botanicals, and world-class spirits manufacturing.',
})

// Interactive Process Stages
const activeProcessStep = ref(0)
const processSteps = [
  {
    step: '01',
    title: 'Highland Agronomy & Sourcing',
    category: 'RAW BOTANICALS & GRAIN',
    summary: 'Partnering directly with regional Ethiopian farmers across the Rift Valley and Oromia highlands.',
    description: 'Every spirit begins with non-GMO Ethiopian grains and indigenous botanicals. Our master distillers personally source wild highland juniper berries, fragrant sun-dried kosoret, hand-harvested citrus peel, wild ginger (zingiber), and estate-grown Yirgacheffe coffee beans directly from agricultural cooperatives. Each incoming harvest undergoes rigorous moisture, starch, and aroma evaluation in our receiving bays.',
    specs: ['Direct Farmer Partnerships', '100% Non-GMO Ethiopian Grains', 'Lot-by-Lot Terpene Screening', 'Zero Synthetic Flavors'],
    tag: 'AGRONOMY',
  },
  {
    step: '02',
    title: 'Pure Aquifer Water & Maceration',
    category: 'MINERAL EXTRACTION',
    summary: 'Multi-stage reverse osmosis spring water preserving delicate mineral balance for authentic mouthfeel.',
    description: 'Water is the invisible foundation of spirit character. Our manufacturing campus taps deep volcanic mountain aquifers, passing water through a custom 6-stage purification system: multimedia sediment beds, activated carbon adsorption, and double-pass reverse osmosis, followed by calibrated remineralization. Selected botanicals undergo cold-temperature slow maceration up to 72 hours to coax out aromatic essential oils without astringent bitter tannins.',
    specs: ['Volcanic Aquifer Water', '6-Stage RO & Remineralization', 'Cold Slow Maceration (14°C)', 'Gentle Terpene Preservation'],
    tag: 'EXTRACTION',
  },
  {
    step: '03',
    title: 'Dual-Mode Fractional Distillation',
    category: 'PRECISION FRACTIONATION',
    summary: 'Combining modern continuous multi-column towers with handcrafted copper alembic pot finishing.',
    description: 'Our distillation floor operates a hybrid engineering architecture: multi-column continuous stainless-steel rectification towers producing ultra-pure 96.2% neutral ethyl spirit, paired with custom-hammered Italian copper alembic pot stills. The copper catalytically strips sulfur compounds, creating an impeccably smooth base. During gin and herbal spirit runs, botanical vapor baskets suspend delicate aromatics in the vapor path, capturing bright top-notes.',
    specs: ['Multi-Column Rectification (96.2% ABV)', 'Custom Copper Alembic Finisher', 'Vapor-Infusion Extraction Basket', 'Continuous Computerized Reflux'],
    tag: 'DISTILLATION',
  },
  {
    step: '04',
    title: 'Multi-Stage Charcoal Filtration & Resting',
    category: 'PURITY & STABILIZATION',
    summary: 'Activated coconut-shell charcoal filtration and stainless vat resting for velvety integration.',
    description: 'Following distillation, spirits rest in climate-controlled stainless-steel aging vats for a minimum of 21 days, allowing alcohol and water molecules to achieve molecular equilibrium. For our ultra-clean vodkas and aperitifs, the distillate undergoes slow gravity-fed filtration through triple-bed activated coconut-shell carbon filters at sub-zero temperatures, eliminating micro-congeners while retaining a rich, viscous mouthfeel.',
    specs: ['Triple-Bed Coconut Carbon', 'Sub-Zero Chill Stabilization (-4°C)', '21-Day Vat Integration Rest', 'Micro-Congener Removal'],
    tag: 'REFINEMENT',
  },
  {
    step: '05',
    title: 'Clean-Room Bottling & Serialization',
    category: 'AUTOMATED PACKAGING',
    summary: 'High-speed automated Italian bottling line with de-ionized air rinsing and laser serialization.',
    description: 'The finished spirit moves to our Class-100 clean-room packaging wing. Bottles are inverted, rinsed with de-ionized nitrogen air, volumetrically gravity-filled, and sealed with tamper-evident caps. High-speed optical inspection systems verify liquid level down to the millimeter, followed by automated labeling and laser lot-coding ensuring complete farm-to-bottle traceability across our national distribution hubs.',
    specs: ['De-Ionized Nitrogen Rinsing', 'Volumetric ±0.5ml Accuracy', 'Automated Optical QC Cameras', 'Unique Laser Lot Coding'],
    tag: 'PACKAGING',
  },
]

// Engineering & Manufacturing Pillars
const facilityPillars = [
  {
    metric: '1',
    unit: 'Campus',
    title: 'Central Manufacturing Plant',
    text: 'Located in the Addis Ababa industrial zone, featuring high-efficiency multi-column distillation towers, artisanal copper stills, and an integrated quality control laboratory.',
  },
  {
    metric: '2',
    unit: 'Hubs',
    title: 'Climate-Controlled Warehouses',
    text: 'Strategic logistics and temperature-regulated distribution depots supplying hospitality venues, retailers, and regional hubs across Ethiopia with rapid fulfillment.',
  },
  {
    metric: '80+',
    unit: 'Specialists',
    title: 'Dedicated Local Team',
    text: 'Distillery engineers, master blenders, chemical technicians, and bottling craftspeople—with over 60% recruited and continuously upskilled from our surrounding community.',
  },
  {
    metric: '10',
    unit: 'Spirits',
    title: 'Craft & Commercial Portfolio',
    text: 'From London-style Dry Gin and crystalline Vodka to traditional Zebib, herbal Aperitifs, and pure commercial ethyl alcohol engineered to pharmaceutical grade.',
  },
]

// Quality Standards & Laboratory Matrix
const qualityStandards = [
  {
    title: 'Gas Chromatography (GC-MS)',
    detail: 'Every single distillation batch is analyzed with on-site Gas Chromatography to profile volatile congeners, ensure zero methanol thresholds, and guarantee chemical purity.',
  },
  {
    title: '0.1% ABV Proofing Accuracy',
    detail: 'Digital density meters and Anton Paar precision alcohol hydrometers ensure exact proofing compliance across every batch before releasing to the bottling hall.',
  },
  {
    title: 'Sensory Panel Verification',
    detail: 'A certified panel of distillery sensory evaluators performs blind olfactory, palate, and finish tastings to confirm signature botanical profiles match factory standards.',
  },
  {
    title: 'Traceability & Compliance',
    detail: 'Certified under Ethiopian Conformity Assessment Enterprise (ECAE) standards and aligned with international ISO 9001 quality and ISO 14001 environmental frameworks.',
  },
]

// Timeline Milestones
const milestones = [
  {
    year: '2012',
    title: 'Foundation & Commissioning',
    description: 'Balezaf Biherawi Alcohol & Liquor Factory establishes its manufacturing campus in Addis Ababa, pioneering modern commercial distillation infrastructure in Ethiopia.',
  },
  {
    year: '2016',
    title: 'Bottling Automation & Warehouse Expansion',
    description: 'Installed high-speed automated European bottling and capping equipment and opened a second temperature-regulated warehouse to support growing regional demand.',
  },
  {
    year: '2020',
    title: 'Launch of the Desta Craft Series',
    description: 'Master distillers introduce the Desta spirits portfolio (Dry Gin, Premium Vodka, Zebib), bringing Ethiopian botanicals and modern mixology together.',
  },
  {
    year: '2024',
    title: 'Closed-Loop Sustainability Initiative',
    description: 'Completed a major sustainability retrofitting: installed a closed-loop condenser water recycling system reducing fresh water usage by 65%, and began upcycling spent botanicals.',
  },
  {
    year: 'Present',
    title: 'National Distribution & Beyond',
    description: 'Over 10 spirits produced daily, powering Ethiopia’s finest hotels, bars, restaurants, and retail spaces with an uncompromising standard of craft and consistency.',
  },
]

// Sustainability Commitments
const sustainabilityMetrics = [
  {
    stat: '65%',
    label: 'Water Recirculation',
    desc: 'Closed-loop cooling towers recycle condensation water throughout distillation, vastly reducing municipal fresh water intake.',
  },
  {
    stat: '100%',
    label: 'Botanical Upcycling',
    desc: 'Spent grain and extracted botanical biomass are converted into nutrient-rich organic compost and bio-fertilizer for local highland farmers.',
  },
  {
    stat: '100%',
    label: 'Recyclable Packaging',
    desc: 'Bottled exclusively in recyclable flint glass with lead-free closures and FSC-certified paper labels with non-toxic vegetal inks.',
  },
  {
    stat: 'Zero',
    label: 'Synthetic Additives',
    desc: 'No artificial flavorings, high-fructose corn syrups, or synthetic coloring agents are ever introduced into our spirit formulas.',
  },
]

// Master Craftspeople & Staff Testimonials
const staffTeam = [
  {
    name: 'Dawit Tadesse',
    role: 'Master Distiller & Head of Production',
    tenure: '9 Years at Balezaf',
    image: '/images/staff-distiller.jpg',
    specialty: 'Fractional Distillation & Botanical Infusion',
    quote: 'Distillation is both rigorous chemistry and sacred sensory intuition. When you stand next to the copper pot still at 6:00 AM, smelling the bright citrus and wild kosoret as the spirit vapors rise, you feel the soul of Ethiopia in every drop.',
    highlights: ['Supervised 2,400+ distillation runs', 'Pioneered signature Desta recipes', 'Trained 18 young apprentices'],
  },
  {
    name: 'Dr. Bethlehem Assefa',
    role: 'Chief Quality Chemist & Laboratory Director',
    tenure: '6 Years at Balezaf',
    image: '/images/staff-chemist.jpg',
    specialty: 'Gas Chromatography & Chemical Purity',
    quote: 'Our laboratory never compromises. We hold every single batch to tighter tolerances than international benchmarks—testing for molecular clarity, volatile congeners, and absolute proof accuracy before a single bottle is cleared.',
    highlights: ['M.Sc. Analytical Chemistry (AAU)', 'ECAE Quality Compliance Lead', '100% batch release verification'],
  },
  {
    name: 'Henok Alemu',
    role: 'Senior Packaging & Operations Supervisor',
    tenure: '7 Years at Balezaf',
    image: '/images/staff-packaging.jpg',
    specialty: 'Automated Line Engineering & Logistics',
    quote: 'I joined Balezaf as a junior maintenance technician in 2017 and grew into supervising the automated bottling hall. The culture here is like family: we take immense pride seeing our bottles celebrated at gatherings across Ethiopia.',
    highlights: ['Promoted from vocational trainee', 'Maintains 99.4% line efficiency', 'Zero-breakage handling lead'],
  },
]
</script>

<template>
  <div class="min-h-screen bg-[#fffdf9] text-[#173b2b] selection:bg-[#c6dfbc] selection:text-[#173b2b]">
    <SiteHeader />

    <main>
      <!-- ============================================== -->
      <!-- 1. HERO SECTION: Grand Architectural Statement -->
      <!-- ============================================== -->
      <section class="relative overflow-hidden bg-[#173b2b] px-6 py-24 text-white sm:py-32 lg:px-12">
        <!-- Subtle Ambient Background Pattern -->
        <div class="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#c6dfbc_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div class="relative mx-auto max-w-7xl">
          <div class="max-w-4xl">
            <div class="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#b8d7af]">
              <span>Balezaf Biherawi Alcohol &amp; Liquor Factory</span>
              <span class="text-white/40">·</span>
              <span>Est. 2012 · Addis Ababa</span>
            </div>

            <h1 class="mt-6 font-serif text-5xl leading-[1.08] tracking-tight sm:text-7xl lg:text-8xl">
              Precision manufacturing.<br />
              <em class="font-normal text-[#b8d7af]">Ethiopian character.</em>
            </h1>

            <p class="mt-8 max-w-2xl text-lg leading-relaxed text-[#d8e7d4] sm:text-xl">
              We engineer world-class spirits at the intersection of modern fractional distillation, advanced analytical chemistry, and centuries of indigenous Ethiopian botanical wisdom.
            </p>

            <div class="mt-10 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <NuxtLink
                to="/products"
                class="rounded-full bg-[#c6dfbc] px-7 py-3.5 text-[#173b2b] shadow-sm transition hover:bg-white"
              >
                Explore Spirits Portfolio ↗
              </NuxtLink>
              <NuxtLink
                to="/#contact"
                class="rounded-full border border-white/25 px-7 py-3.5 text-white backdrop-blur-xs transition hover:bg-white/10"
              >
                Schedule Factory Visit / Tour
              </NuxtLink>
            </div>
          </div>

          <!-- Quick Stat Strip Along Hero Bottom -->
          <div class="mt-20 grid grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4 lg:gap-10">
            <div>
              <span class="block font-serif text-3xl font-bold text-white sm:text-4xl">1</span>
              <span class="mt-1 block text-xs uppercase tracking-wider text-[#9fc495]">Production Campus</span>
              <p class="mt-0.5 text-xs text-[#c6dfbc]/75">Addis Ababa Industrial Zone</p>
            </div>
            <div>
              <span class="block font-serif text-3xl font-bold text-white sm:text-4xl">80+</span>
              <span class="mt-1 block text-xs uppercase tracking-wider text-[#9fc495]">Distillery Engineers</span>
              <p class="mt-0.5 text-xs text-[#c6dfbc]/75">Master distillers &amp; technicians</p>
            </div>
            <div>
              <span class="block font-serif text-3xl font-bold text-white sm:text-4xl">2</span>
              <span class="mt-1 block text-xs uppercase tracking-wider text-[#9fc495]">Logistics Hubs</span>
              <p class="mt-0.5 text-xs text-[#c6dfbc]/75">Warehousing &amp; cold storage</p>
            </div>
            <div>
              <span class="block font-serif text-3xl font-bold text-white sm:text-4xl">10+</span>
              <span class="mt-1 block text-xs uppercase tracking-wider text-[#9fc495]">Spirits Manufactured</span>
              <p class="mt-0.5 text-xs text-[#c6dfbc]/75">Craft spirits to industrial ethyl</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- 2. FOUNDING STORY: Terroir, Culture, & Scale   -->
      <!-- ============================================== -->
      <section class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-12">
        <div class="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-[#65975d]">Our Heritage &amp; Purpose</p>
            <h2 class="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Elevating Ethiopian distillation to <em class="font-normal text-[#65975d]">global stature.</em>
            </h2>

            <div class="mt-8 space-y-6 text-base leading-relaxed text-[#355944] sm:text-lg">
              <p>
                Ethiopia has celebrated community drinks rituals for millennia—from the shared conviviality of traditional gathering halls to fragrant botanical decoctions brewed in highland homesteads. 
                Yet for decades, high-precision commercial spirits across East Africa were dominated by generic imports.
              </p>
              <p>
                In 2012, <strong>Balezaf Biherawi Alcohol &amp; Liquor Factory</strong> was founded in Addis Ababa to rewrite that narrative. We set out to build a modern, high-capacity distillery that honors the distinctiveness of Ethiopian botanicals while adopting the strict engineering, automated quality control, and fractional rectification demanded by premier international distilleries.
              </p>
              <p>
                Today, our facility manufactures both our acclaimed craft spirits portfolio (headed by our flagship <strong>Desta Dry Gin</strong>, <strong>Desta Premium Vodka</strong>, and artisanal <strong>Desta Zebib</strong>) and pure technical and commercial ethyl spirits that power food, hospitality, and pharmaceutical supply chains throughout the country.
              </p>
            </div>

            <!-- Authentic Pillars List -->
            <div class="mt-10 grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-[#dce8d7] bg-[#f8faf6] p-5">
                <span class="text-lg text-[#52965b]">❖</span>
                <h3 class="mt-2 text-sm font-bold text-[#173b2b]">Indigenous Botanical Terroir</h3>
                <p class="mt-1 text-xs leading-relaxed text-[#55715a]">
                  We extract essential oils from wild highland juniper, kosoret, gesho, and citrus grown in mineral-rich volcanic soils.
                </p>
              </div>

              <div class="rounded-2xl border border-[#dce8d7] bg-[#f8faf6] p-5">
                <span class="text-lg text-[#52965b]">❖</span>
                <h3 class="mt-2 text-sm font-bold text-[#173b2b]">Rigorous Process Engineering</h3>
                <p class="mt-1 text-xs leading-relaxed text-[#55715a]">
                  Continuous computerized reflux columns paired with Italian copper alembics for unmatched purity and zero congener harshness.
                </p>
              </div>
            </div>
          </div>

          <!-- Editorial Plant Architecture Callout Card -->
          <div class="relative overflow-hidden rounded-3xl border border-[#dce8d7] bg-[#173b2b] p-8 text-white shadow-xl sm:p-12">
            <div class="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#52965b]/20 blur-3xl"></div>

            <span class="text-xs font-bold uppercase tracking-[0.25em] text-[#b8d7af]">Technical Facility Profile</span>
            <h3 class="mt-4 font-serif text-3xl font-semibold sm:text-4xl">Addis Ababa Central Plant</h3>
            <p class="mt-4 text-sm leading-relaxed text-[#d8e7d4]">
              Our manufacturing infrastructure operates around the clock, integrating primary rectification columns, botanical vapor infusion pods, clean-room bottling lines, and on-site chemical testing labs.
            </p>

            <dl class="mt-8 space-y-4 border-t border-white/15 pt-6 text-xs">
              <div class="flex items-center justify-between">
                <dt class="text-[#9fc495]">Location</dt>
                <dd class="font-semibold text-white">Addis Ababa, Ethiopia</dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-[#9fc495]">Operating Capacity</dt>
                <dd class="font-semibold text-white">High-Speed Automated Bottling</dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-[#9fc495]">Distillation Architecture</dt>
                <dd class="font-semibold text-white">Continuous Column + Alembic Pot</dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-[#9fc495]">Storage &amp; Logistics</dt>
                <dd class="font-semibold text-white">2 Regional Hubs (Climate-Controlled)</dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-[#9fc495]">Quality Standards</dt>
                <dd class="font-semibold text-white">ECAE Certified · ISO Aligned</dd>
              </div>
            </dl>

            <div class="mt-8 rounded-xl bg-white/10 p-4 backdrop-blur-xs">
              <p class="text-[11px] leading-relaxed text-[#c6dfbc]">
                “True manufacturing excellence is not merely about output; it is about guaranteeing that every sip poured from any Balezaf bottle delivers consistent aroma, pristine clarity, and pure character.”
              </p>
              <span class="mt-2 block text-[10px] font-bold uppercase tracking-wider text-white/70">— Plant Engineering Directorate</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- 3. INTERACTIVE MANUFACTURING PROCESS: 5 Stages -->
      <!-- ============================================== -->
      <section class="bg-[#f2f7ef] px-6 py-24 sm:py-32 lg:px-12">
        <div class="mx-auto max-w-7xl">
          <div class="text-center max-w-3xl mx-auto">
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#65975d]">Manufacturing Lifecycle</p>
            <h2 class="mt-3 font-serif text-4xl font-semibold sm:text-5xl lg:text-6xl text-[#173b2b]">
              Engineered for purity from <em class="font-normal text-[#65975d]">harvest to seal.</em>
            </h2>
            <p class="mt-5 text-base text-[#527359] leading-relaxed">
              Explore how raw agricultural commodities and highland mountain water are transformed into refined, award-winning Ethiopian spirits through our 5-stage production ecosystem.
            </p>
          </div>

          <!-- Step Selector Tabs -->
          <div class="mt-14 flex items-center justify-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            <button
              v-for="(item, idx) in processSteps"
              :key="item.step"
              type="button"
              class="flex items-center gap-2.5 rounded-full px-5 py-3 text-xs font-semibold transition shrink-0"
              :class="activeProcessStep === idx ? 'bg-[#173b2b] text-white shadow-md' : 'bg-white text-[#456b4f] hover:bg-[#e4ede1] border border-[#d0ded0]'"
              @click="activeProcessStep = idx"
            >
              <span class="font-mono text-[10px] opacity-75">{{ item.step }}</span>
              <span>{{ item.title }}</span>
            </button>
          </div>

          <!-- Active Step Deep-Dive Card -->
          <div class="mt-8 overflow-hidden rounded-3xl border border-[#dce8d7] bg-white shadow-lg transition-all duration-300">
            <div class="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div class="p-8 sm:p-12">
                <div class="flex items-center gap-3">
                  <span class="rounded bg-[#edf4eb] px-2.5 py-1 font-mono text-xs font-bold text-[#2b5837]">
                    STAGE {{ processSteps[activeProcessStep].step }}
                  </span>
                  <span class="text-xs font-bold tracking-wider text-[#65975d] uppercase">
                    {{ processSteps[activeProcessStep].category }}
                  </span>
                </div>

                <h3 class="mt-4 font-serif text-3xl font-semibold text-[#173b2b] sm:text-4xl">
                  {{ processSteps[activeProcessStep].title }}
                </h3>

                <p class="mt-3 text-sm font-semibold text-[#3b6647] leading-relaxed">
                  {{ processSteps[activeProcessStep].summary }}
                </p>

                <p class="mt-5 text-sm leading-relaxed text-[#55715a]">
                  {{ processSteps[activeProcessStep].description }}
                </p>

                <div class="mt-8 border-t border-[#edf3ea] pt-6">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-[#173b2b]">Key Engineering Standards:</h4>
                  <ul class="mt-3 grid gap-2.5 sm:grid-cols-2">
                    <li
                      v-for="spec in processSteps[activeProcessStep].specs"
                      :key="spec"
                      class="flex items-center gap-2 text-xs font-medium text-[#2d5837]"
                    >
                      <span class="text-[#52965b]">✓</span>
                      <span>{{ spec }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Navigation between steps -->
                <div class="mt-10 flex items-center justify-between border-t border-[#edf3ea] pt-6">
                  <button
                    type="button"
                    :disabled="activeProcessStep === 0"
                    class="rounded-full px-4 py-2 text-xs font-semibold text-[#173b2b] transition hover:bg-[#edf5e9] disabled:opacity-30 disabled:pointer-events-none"
                    @click="activeProcessStep--"
                  >
                    ← Previous Stage
                  </button>

                  <span class="font-mono text-xs text-[#728f76]">
                    {{ activeProcessStep + 1 }} of {{ processSteps.length }}
                  </span>

                  <button
                    type="button"
                    :disabled="activeProcessStep === processSteps.length - 1"
                    class="rounded-full bg-[#173b2b] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#2b593a] disabled:opacity-30 disabled:pointer-events-none"
                    @click="activeProcessStep++"
                  >
                    Next Stage →
                  </button>
                </div>
              </div>

              <!-- Graphic / Technical Metric Box -->
              <div class="flex flex-col justify-between bg-[#173b2b] p-8 text-white sm:p-12">
                <div>
                  <div class="flex items-center justify-between text-xs text-[#9fc495]">
                    <span class="uppercase tracking-widest">Process Blueprint</span>
                    <span class="font-mono">P-{{ processSteps[activeProcessStep].step }}</span>
                  </div>

                  <h4 class="mt-6 font-serif text-2xl font-bold sm:text-3xl text-white">
                    {{ processSteps[activeProcessStep].tag }}
                  </h4>

                  <p class="mt-4 text-xs leading-relaxed text-[#c6dfbc]">
                    Every step in our facility is strictly documented via batch records, sensor logging, and automated instrumentation to preserve flavor integrity year after year.
                  </p>
                </div>

                <div class="mt-8 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-xs space-y-4">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-[#9fc495]">Validation Method</span>
                    <span class="font-semibold text-white">Physical &amp; Chemical QA</span>
                  </div>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-[#9fc495]">Atmospheric State</span>
                    <span class="font-semibold text-white">Controlled Environment</span>
                  </div>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-[#9fc495]">Batch Retention</span>
                    <span class="font-semibold text-white">Sample Vault (5 Years)</span>
                  </div>
                </div>

                <div class="mt-8 border-t border-white/10 pt-4 text-right">
                  <NuxtLink
                    to="/products"
                    class="text-xs font-semibold text-[#b8d7af] transition hover:text-white"
                  >
                    View resulting bottles in catalogue →
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- 4. QUALITY ASSURANCE & LABORATORY TESTING      -->
      <!-- ============================================== -->
      <section class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-12">
        <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-[#65975d]">Analytical Precision</p>
            <h2 class="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl text-[#173b2b]">
              The science of <em class="font-normal text-[#65975d]">uncompromising quality.</em>
            </h2>
            <p class="mt-6 text-base leading-relaxed text-[#43654e]">
              Consistency is not achieved by chance; it is tested, measured, and verified. Our on-site laboratory acts as the frontline of our manufacturing integrity, enforcing analytical testing across every step of distillation, maturation, and packaging.
            </p>

            <div class="mt-8 rounded-2xl border border-[#dce8d7] bg-[#f8faf6] p-6 space-y-3">
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-xs font-bold uppercase tracking-wider text-[#173b2b]">Live Quality Protocol</span>
              </div>
              <p class="text-xs text-[#527359] leading-relaxed">
                Before any liquid enters our bottling line, three independent laboratory checks must be signed off: chromatographic congener screening, electronic ABV verification, and sensory committee unanimous clearance.
              </p>
            </div>
          </div>

          <!-- Quality Cards Grid -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div
              v-for="std in qualityStandards"
              :key="std.title"
              class="rounded-3xl border border-[#dfe9da] bg-white p-7 shadow-2xs hover:shadow-md transition"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5e9] text-base text-[#285736] font-bold">
                ✓
              </div>
              <h3 class="mt-4 font-serif text-xl font-semibold text-[#173b2b]">{{ std.title }}</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#55715a]">{{ std.detail }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- 5. SUSTAINABLE MANUFACTURING: Circular Blueprint-->
      <!-- ============================================== -->
      <section class="bg-[#173b2b] px-6 py-24 text-white sm:py-32 lg:px-12">
        <div class="mx-auto max-w-7xl">
          <div class="max-w-3xl">
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#b8d7af]">Environmental Stewardship</p>
            <h2 class="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Sustainable craft for the <em class="font-normal text-[#b8d7af]">generations ahead.</em>
            </h2>
            <p class="mt-6 text-base leading-relaxed text-[#d8e7d4] sm:text-lg">
              We operate with profound respect for the soil, water, and communities that nurture our ingredients. Our engineering initiatives are designed to minimize resource consumption and eliminate landfill waste.
            </p>
          </div>

          <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="metric in sustainabilityMetrics"
              :key="metric.label"
              class="rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur-xs hover:bg-white/10 transition"
            >
              <strong class="font-serif text-4xl font-bold text-[#b8d7af] sm:text-5xl">{{ metric.stat }}</strong>
              <h3 class="mt-3 text-sm font-bold uppercase tracking-wider text-white">{{ metric.label }}</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#c6dfbc]">{{ metric.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- 6. COMMUNITY WORK & SOCIAL RESPONSIBILITY     -->
      <!-- ============================================== -->
      <section class="bg-[#f8faf5] px-6 py-24 sm:py-32 lg:px-12 border-y border-[#dce8d7]">
        <div class="mx-auto max-w-7xl">
          <div class="max-w-3xl">
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#65975d]">Community &amp; Social Responsibility</p>
            <h2 class="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl text-[#173b2b]">
              Rooted in the soil. <em class="font-normal text-[#65975d]">Invested in our people.</em>
            </h2>
            <p class="mt-6 text-base leading-relaxed text-[#43654e] sm:text-lg">
              As an Ethiopian manufacturer, our responsibility extends far beyond the factory gates. We actively partner with regional farming communities, invest in watershed reforestation, fund rural clean water access, and provide technical career pathways for Ethiopian youth.
            </p>
          </div>

          <!-- Featured Visual Photo Stories -->
          <div class="mt-16 grid gap-10 lg:grid-cols-2">
            <!-- Story 1: Highland Reforestation -->
            <div class="group flex flex-col overflow-hidden rounded-3xl border border-[#dce8d7] bg-white shadow-sm transition hover:shadow-xl hover:border-[#65975d]/40">
              <div class="relative h-72 sm:h-84 w-full overflow-hidden bg-[#173b2b]">
                <img
                  src="/images/reforestation.jpg"
                  alt="Ethiopian community members planting trees in highland reforestation initiative"
                  class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div class="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                  <span class="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#173b2b] backdrop-blur-xs">
                    Green Canopy Project
                  </span>
                  <span class="text-xs font-semibold text-white/90">Oromia &amp; Rift Valley Highlands</span>
                </div>
              </div>

              <div class="flex flex-1 flex-col justify-between p-7 sm:p-9">
                <div>
                  <h3 class="font-serif text-2xl font-bold text-[#173b2b] sm:text-3xl">
                    Highland Watershed &amp; Tree Planting Initiative
                  </h3>
                  <p class="mt-4 text-sm leading-relaxed text-[#55715a]">
                    Named after <em>Balezaf</em> (ባህር ዛፍ)—the iconic trees that shade Ethiopia’s highland terrain—we lead annual community tree planting drives alongside agricultural cooperatives and local youth. Over <strong>60,000+ native acacia, wild juniper, and eucalyptus seedlings</strong> have been planted across vulnerable hillside watersheds to curb soil erosion, restore tree cover, and naturally safeguard mountain aquifer springs.
                  </p>
                </div>

                <div class="mt-8 grid grid-cols-3 gap-3 border-t border-[#edf3ea] pt-6 text-center">
                  <div>
                    <strong class="font-serif text-2xl font-bold text-[#285736] sm:text-3xl">60,000+</strong>
                    <span class="mt-0.5 block text-[11px] text-[#718e75] uppercase tracking-wider">Seedlings Planted</span>
                  </div>
                  <div>
                    <strong class="font-serif text-2xl font-bold text-[#285736] sm:text-3xl">150+</strong>
                    <span class="mt-0.5 block text-[11px] text-[#718e75] uppercase tracking-wider">Hectares Protected</span>
                  </div>
                  <div>
                    <strong class="font-serif text-2xl font-bold text-[#285736] sm:text-3xl">12</strong>
                    <span class="mt-0.5 block text-[11px] text-[#718e75] uppercase tracking-wider">Highland Co-ops</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Story 2: Clean Water Access -->
            <div class="group flex flex-col overflow-hidden rounded-3xl border border-[#dce8d7] bg-white shadow-sm transition hover:shadow-xl hover:border-[#65975d]/40">
              <div class="relative h-72 sm:h-84 w-full overflow-hidden bg-[#173b2b]">
                <img
                  src="/images/clean-water.jpg"
                  alt="Ethiopian rural community collecting potable water from modern tap stations"
                  class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div class="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                  <span class="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#173b2b] backdrop-blur-xs">
                    Clean Water Access
                  </span>
                  <span class="text-xs font-semibold text-white/90">Peri-Urban &amp; Rural Woredas</span>
                </div>
              </div>

              <div class="flex flex-1 flex-col justify-between p-7 sm:p-9">
                <div>
                  <h3 class="font-serif text-2xl font-bold text-[#173b2b] sm:text-3xl">
                    Solar-Powered Community Water Stations
                  </h3>
                  <p class="mt-4 text-sm leading-relaxed text-[#55715a]">
                    Water is the heart of distillation and the essential lifeline of human dignity. We leveraged our water-treatment engineering expertise to finance, drill, and construct <strong>4 deep-aquifer solar-pumped public water tap stations</strong> in neighboring rural communities. Today, more than 8,500 residents, mothers, and school children access clean, certified drinking water daily, eliminating hours of hazardous daily collection treks.
                  </p>
                </div>

                <div class="mt-8 grid grid-cols-3 gap-3 border-t border-[#edf3ea] pt-6 text-center">
                  <div>
                    <strong class="font-serif text-2xl font-bold text-[#285736] sm:text-3xl">4</strong>
                    <span class="mt-0.5 block text-[11px] text-[#718e75] uppercase tracking-wider">Well Stations Built</span>
                  </div>
                  <div>
                    <strong class="font-serif text-2xl font-bold text-[#285736] sm:text-3xl">8,500+</strong>
                    <span class="mt-0.5 block text-[11px] text-[#718e75] uppercase tracking-wider">Villagers Served</span>
                  </div>
                  <div>
                    <strong class="font-serif text-2xl font-bold text-[#285736] sm:text-3xl">Zero</strong>
                    <span class="mt-0.5 block text-[11px] text-[#718e75] uppercase tracking-wider">Cost to Families</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Community Pillars: Farmers & Youth Apprenticeships -->
          <div class="mt-10 grid gap-6 sm:grid-cols-2">
            <div class="rounded-3xl border border-[#dce8d7] bg-white p-7 sm:p-8 shadow-2xs">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5e9] text-[#285736] font-bold">
                  🌱
                </div>
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-[#65975d]">Direct Fair-Trade</span>
                  <h4 class="text-base font-bold text-[#173b2b]">Highland Farming Family Partnership</h4>
                </div>
              </div>
              <p class="mt-4 text-xs leading-relaxed text-[#55715a]">
                We buy raw ingredients directly from over 120 smallholder Ethiopian farming households cultivating kosoret, wild gesho, ginger, and citrus rinds. By eliminating predatory middlemen and establishing multi-year harvest contracts with guaranteed above-market pricing, we provide predictable economic stability for rural families while securing the purest aromatic crops.
              </p>
            </div>

            <div class="rounded-3xl border border-[#dce8d7] bg-white p-7 sm:p-8 shadow-2xs">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5e9] text-[#285736] font-bold">
                  ⚙️
                </div>
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-[#65975d]">Youth Development</span>
                  <h4 class="text-base font-bold text-[#173b2b]">Distillery Engineering Apprenticeships</h4>
                </div>
              </div>
              <p class="mt-4 text-xs leading-relaxed text-[#55715a]">
                Our annual technical apprenticeship program provides paid vocational education to young Ethiopian women and men from neighboring districts. Trainees gain hands-on expertise in chemical laboratory analysis, mechanical distillation maintenance, and automated packaging logistics. Over 70% of graduates transition directly into permanent, pension-backed positions at our campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- 7. STAFF TESTIMONIALS & MASTER CRAFTSPEOPLE    -->
      <!-- ============================================== -->
      <section class="bg-white px-6 py-24 sm:py-32 lg:px-12 border-b border-[#dce8d7]">
        <div class="mx-auto max-w-7xl">
          <div class="max-w-3xl">
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#65975d]">The People of Balezaf</p>
            <h2 class="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl text-[#173b2b]">
              The master distillers &amp; engineers <em class="font-normal text-[#65975d]">behind every batch.</em>
            </h2>
            <p class="mt-6 text-base leading-relaxed text-[#43654e] sm:text-lg">
              World-class spirits aren’t engineered by automated machinery alone. Meet the Ethiopian chemists, stillmasters, and line supervisors whose daily dedication, exacting standards, and pride shape every bottle leaving our factory.
            </p>
          </div>

          <!-- Staff Cards Grid -->
          <div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="member in staffTeam"
              :key="member.name"
              class="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#dfe9da] bg-[#fffdfa] shadow-xs transition hover:shadow-xl hover:border-[#65975d]/50"
            >
              <div>
                <!-- Staff Image Container -->
                <div class="relative h-72 sm:h-80 w-full overflow-hidden bg-[#173b2b]">
                  <img
                    :src="member.image"
                    :alt="member.name + ' - ' + member.role"
                    class="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
                  
                  <div class="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                    <div>
                      <span class="inline-block rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#173b2b] shadow-xs">
                        {{ member.tenure }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Content & Quote -->
                <div class="p-7 sm:p-8">
                  <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#65975d]">
                    <span>{{ member.specialty }}</span>
                  </div>

                  <h3 class="mt-2 font-serif text-2xl font-bold text-[#173b2b]">
                    {{ member.name }}
                  </h3>
                  <p class="text-xs font-medium text-[#718e75]">
                    {{ member.role }}
                  </p>

                  <div class="relative mt-5 border-l-2 border-[#b8d7af] pl-4">
                    <p class="font-serif text-sm italic leading-relaxed text-[#2c5339]">
                      “{{ member.quote }}”
                    </p>
                  </div>

                  <!-- Highlights List -->
                  <div class="mt-6 space-y-2 border-t border-[#edf3ea] pt-5">
                    <div
                      v-for="item in member.highlights"
                      :key="item"
                      class="flex items-center gap-2 text-xs text-[#55715a]"
                    >
                      <span class="text-[#285736] font-bold">✓</span>
                      <span>{{ item }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Workplace Culture Callout -->
          <div class="mt-14 rounded-3xl border border-[#dce8d7] bg-[#f8faf5] p-8 sm:p-10 lg:p-12">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div class="max-w-2xl">
                <span class="text-xs font-bold uppercase tracking-[0.2em] text-[#65975d]">Workplace Excellence</span>
                <h4 class="mt-2 font-serif text-2xl font-bold text-[#173b2b] sm:text-3xl">
                  A culture of safety, continuous growth &amp; equal opportunity.
                </h4>
                <p class="mt-3 text-sm leading-relaxed text-[#55715a]">
                  We believe industrial manufacturing should uplift the local workforce. We provide 100% employer-sponsored health coverage, comprehensive safety training, retirement benefits, and leadership development programs across every operational department.
                </p>
              </div>
              <div class="flex flex-col gap-3 shrink-0 sm:flex-row">
                <NuxtLink
                  to="/#contact"
                  class="inline-flex items-center justify-center rounded-full bg-[#173b2b] px-6 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-[#285736]"
                >
                  Join Our Team ↗
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- 8. MILESTONES: Timeline of Growth (2012–Now)   -->
      <!-- ============================================== -->
      <section class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-12">
        <div class="text-center max-w-2xl mx-auto">
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-[#65975d]">Our Trajectory</p>
          <h2 class="mt-3 font-serif text-4xl font-semibold sm:text-5xl text-[#173b2b]">
            Over a decade of <em class="font-normal text-[#65975d]">dedicated distillation.</em>
          </h2>
          <p class="mt-4 text-sm text-[#55715a]">
            From our founding plant commissioning in Addis Ababa to national distribution and modern spirit innovations.
          </p>
        </div>

        <div class="mt-16 relative border-l-2 border-[#dce8d7] ml-4 sm:ml-32 md:ml-48 space-y-12">
          <div
            v-for="m in milestones"
            :key="m.year"
            class="relative pl-8 sm:pl-12 group"
          >
            <!-- Timeline Marker Bullet -->
            <div class="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-[#35653c] shadow-xs group-hover:scale-125 transition-transform"></div>

            <div class="sm:absolute sm:-left-36 md:-left-44 top-0.5 text-right font-serif text-2xl font-bold text-[#285736]">
              {{ m.year }}
            </div>

            <div class="rounded-2xl border border-[#dfe9da] bg-white p-6 shadow-2xs hover:border-[#8ebb84] transition">
              <h3 class="font-serif text-xl font-semibold text-[#173b2b]">{{ m.title }}</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#55715a]">{{ m.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================== -->
      <!-- 7. CAMPUS VISIT & COMMERCIAL PARTNERSHIP CTA   -->
      <!-- ============================================== -->
      <section class="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <div class="relative overflow-hidden rounded-3xl bg-[#173b2b] p-8 text-white sm:p-14 lg:p-16">
          <div class="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#52965b]/25 blur-3xl"></div>

          <div class="relative z-10 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div class="max-w-2xl">
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#b8d7af]">Trade &amp; Hospitality Partnerships</p>
              <h2 class="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Experience our facility.<br />
                <em class="font-normal text-[#b8d7af]">Create something lasting.</em>
              </h2>
              <p class="mt-6 text-sm leading-relaxed text-[#d8e7d4] sm:text-base">
                Whether you are a hospitality group, hotel beverage director, distributor, or cocktail visionary, we invite you to tour our Addis Ababa campus, sample barrel releases, and discuss contract distillation or wholesale allocation.
              </p>
            </div>

            <div class="flex flex-col gap-3 shrink-0 sm:flex-row">
              <NuxtLink
                to="/order"
                class="inline-flex items-center justify-center rounded-full bg-[#c6dfbc] px-7 py-3.5 text-xs font-semibold text-[#173b2b] shadow-sm transition hover:bg-white"
              >
                Wholesale Order Request ↗
              </NuxtLink>
              <NuxtLink
                to="/#contact"
                class="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white/10"
              >
                Contact Factory Management
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
