<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Vacancy {
  id: string
  title?: string
  position_name: string
  company: string
  locations: string[]
  deadline: string
  salary: string
  description: string
  requirements?: string
  createdAt?: string
}

interface WorkExpItem {
  position: string
  employerName: string
  dutiesDescription: string
  employerContact: string
}

// Vacancies state
const vacancies = ref<Vacancy[]>([])
const loading = ref(true)

// Modal state
const isModalOpen = ref(false)
const selectedVacancy = ref<Vacancy | null>(null)
const submitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

// Form state matching the requested structure
const form = ref({
  fullName: '',
  phoneNumber: '',
  email: '',
  workExperience: '',
  gender: 'male' as 'male' | 'female',
  languages: ['Amharic', 'English'] as string[],
  skills: ['basic computer skill', 'microsoft word'] as string[],
  workExperienceInformation: [] as WorkExpItem[],
  uploadedFiles: [] as File[],
})

const availableLanguages = ['Amharic', 'English', 'Tigrigna', 'Afaan Oromo', 'Somali']
const availableSkills = ['basic computer skill', 'microsoft word', 'microsoft excel', 'inventory tracking', 'quality assurance', 'customer relations']
const newLanguageInput = ref('')
const newSkillInput = ref('')

function toggleLanguage(lang: string) {
  const idx = form.value.languages.indexOf(lang)
  if (idx > -1) {
    form.value.languages.splice(idx, 1)
  } else {
    form.value.languages.push(lang)
  }
}

function addCustomLanguage() {
  const val = newLanguageInput.value.trim()
  if (val && !form.value.languages.includes(val)) {
    form.value.languages.push(val)
    newLanguageInput.value = ''
  }
}

function toggleSkill(skill: string) {
  const idx = form.value.skills.indexOf(skill)
  if (idx > -1) {
    form.value.skills.splice(idx, 1)
  } else {
    form.value.skills.push(skill)
  }
}

function addCustomSkill() {
  const val = newSkillInput.value.trim()
  if (val && !form.value.skills.includes(val)) {
    form.value.skills.push(val)
    newSkillInput.value = ''
  }
}

function addWorkExperience() {
  form.value.workExperienceInformation.push({
    position: '',
    employerName: '',
    dutiesDescription: '',
    employerContact: '',
  })
}

function removeWorkExperience(index: number) {
  form.value.workExperienceInformation.splice(index, 1)
}

function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    const filesArray = Array.from(target.files)
    form.value.uploadedFiles.push(...filesArray)
  }
}

function removeFile(index: number) {
  form.value.uploadedFiles.splice(index, 1)
}

function formatDate(dateVal: any): string {
  if (!dateVal) return ''
  try {
    const d = new Date(dateVal)
    return d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
  } catch {
    return String(dateVal)
  }
}

async function fetchVacancies() {
  loading.value = true
  try {
    const res: any = await $fetch('/api/vacancies')
    const rawList = res?.data || []
    const now = new Date()

    // Filter out expired vacancies
    vacancies.value = rawList
      .map((vac: any) => ({
        id: vac.id,
        title: vac.title,
        position_name: vac.position_name || vac.positionName || vac.title,
        company: vac.company || 'BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
        locations: Array.isArray(vac.locations) ? vac.locations : (vac.location ? [vac.location] : ['Addis Ababa']),
        deadline: vac.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        salary: vac.salary || 'based in the company scale',
        description: vac.description,
        requirements: vac.requirements || '<p>Proven experience and dedicated work ethic.</p>',
        createdAt: vac.createdAt,
      }))
      .filter((vac: Vacancy) => {
        if (!vac.deadline) return true
        const deadline = new Date(vac.deadline)
        return deadline >= now
      })
  } catch (err) {
    console.error('Error fetching vacancies:', err)
  } finally {
    loading.value = false
  }
}

function openVacancyApplyModal(vac: Vacancy) {
  selectedVacancy.value = vac
  submitSuccess.value = false
  submitError.value = ''
  form.value = {
    fullName: '',
    phoneNumber: '',
    email: '',
    workExperience: '',
    gender: 'male',
    languages: ['Amharic', 'English'],
    skills: ['basic computer skill', 'microsoft word'],
    workExperienceInformation: [],
    uploadedFiles: [],
  }
  isModalOpen.value = true
}

function closeVacancyApplyModal() {
  isModalOpen.value = false
  selectedVacancy.value = null
}

async function applyVacancy(FD: any, form$: any) {
  if (!selectedVacancy.value) return
  submitting.value = true
  submitError.value = ''

  const formData = new FormData()
  formData.append('vacancyId', selectedVacancy.value.id)

  if (form$.data.uploaded_files && Array.isArray(form$.data.uploaded_files)) {
    form$.data.uploaded_files.forEach((file: any) => {
      formData.append('uploaded_files', file)
    })
  }

  formData.append(
    'application_form',
    JSON.stringify({
      gender: form$.data.gender,
      workExperience: form$.data.workExperience,
      fullName: form$.data.fullName,
      phoneNumber: form$.data.phoneNumber,
      email: form$.data.email,
      skill: form$.data.skill,
      languages: form$.data.languages,
      workExperienceInformation: form$.data.workExperienceInformation,
    })
  )

  try {
    await $fetch('/api/vacancy/apply', {
      method: 'POST',
      headers: { apiref: '/api/vacancy/apply/POST' },
      body: formData,
    })
    frontEndErrorFeedback().success('Vacancy applied successfully')
    submitSuccess.value = true
  } catch (error: any) {
    frontEndErrorFeedback().err(error)
    submitError.value = error?.data?.statusMessage || error?.message || 'Failed to submit application.'
  } finally {
    submitting.value = false
  }
}

// Structured data for vacancies listing
const vacanciesSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Job Vacancies at BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
  description: 'Current career opportunities and job openings at Balezaf Alcohol & Liquors Factory PLC',
  url: 'https://www.balezaf.et/careers',
  numberOfItems: vacancies.value?.length || 0,
  itemListElement:
    vacancies.value?.map((vacancy, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'JobPosting',
        title: vacancy.position_name,
        description: vacancy.description.replace(/<[^>]*>/g, '').substring(0, 200),
        datePosted: vacancy.createdAt,
        validThrough: vacancy.deadline,
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          '@type': 'Organization',
          name: vacancy.company,
          sameAs: 'https://www.balezaf.et/',
        },
        jobLocation: vacancy.locations.map((loc) => ({
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: loc,
            addressCountry: 'ET',
          },
        })),
        applicantLocationRequirements: {
          '@type': 'Country',
          name: 'Ethiopia',
        },
        baseSalary: {
          '@type': 'MonetaryAmount',
          currency: 'ETB',
          value:
            vacancy.salary === 'based in the company scale'
              ? 'Competitive salary based on company scale'
              : vacancy.salary,
        },
      },
    })) || [],
}))

useSeoMeta({
  title: 'Careers - BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
  description: "Join Balezaf Alcohol & Liquors Factory PLC. Explore current job openings and career opportunities in Ethiopia's premier distillery.",
  ogTitle: 'Careers - BALEZAF ALCOHOL & LIQUORS FACTORY PLC',
  ogDescription: 'Join Balezaf. Explore current job openings and career opportunities.',
})

useHead({
  script: [
    {
      key: 'vacancies-list',
      type: 'application/ld+json',
      children: JSON.stringify(vacanciesSchema.value),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.balezaf.et/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Careers',
            item: 'https://www.balezaf.et/careers',
          },
        ],
      }),
    },
  ],
})

onMounted(() => {
  fetchVacancies()
})
</script>

<template>
  <div class="min-h-screen bg-[#fffdf9] text-[#173b2b]">
    <SiteHeader />

    <main class="py-12 px-4 sm:px-6 lg:px-8">
      <!-- Hero Intro -->
      <section class="mx-auto max-w-4xl text-center mb-10">
        <p class="eyebrow">Join Our Team</p>
        <h1 class="mt-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#173b2b]">
          Build the next chapter of <em class="font-normal text-[#547959]">Ethiopian spirits.</em>
        </h1>
        <p class="mt-4 text-base sm:text-lg leading-relaxed text-[#66816b] max-w-2xl mx-auto">
          We are a dedicated team producing award-winning gins, vodkas, and craft liqueurs. Explore our open positions below.
        </p>
      </section>

      <!-- Vacancy Openings Collapsible Section -->
      <div class="job-container shadow-xs">
        <h3 class="job-header">Vacancy openings</h3>

        <div class="job-details">
          <div v-if="loading" class="py-12 text-center text-sm text-[#66816b]">
            Loading open vacancies...
          </div>

          <h5 v-else-if="vacancies.length === 0" class="job-header no-border">
            No posted vacancy for now!
          </h5>

          <!-- Position Section Accordion -->
          <div v-else v-for="(vac, i) in vacancies" :key="vac.id || i" class="section">
            <details>
              <summary>
                <div class="job-discriptions">
                  <h5 class="dis">Position: <span class="value">{{ vac.position_name }}</span></h5>
                  <h5 class="dis">Company: <span class="value">{{ vac.company }}</span></h5>
                  <h5 class="dis">Location: <span class="value">{{ vac.locations.join(', ') }}</span></h5>
                  <h5 class="dis">Deadline: <span class="value">{{ formatDate(vac.deadline) }}</span></h5>
                  <h5 class="dis">Salary: <span class="value">{{ vac.salary }}</span></h5>
                </div>
              </summary>

              <div class="content">
                <div class="job-discriptions">
                  <h5 class="dis font-bold">Description</h5>
                  <p class="text-sm text-[#38533e] leading-relaxed">{{ vac.description }}</p>
                </div>

                <div v-if="vac.requirements" class="mt-4">
                  <h5 class="dis font-bold mb-1">Requirements</h5>
                  <div class="quill-html-content text-sm text-[#38533e]" v-html="vac.requirements"></div>
                </div>

                <div class="apply-button">
                  <button type="button" @click="openVacancyApplyModal(vac)">
                    To Apply, Click Here ↗
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </main>

    <!-- Vacancy Apply Modal Overlay -->
    <Teleport to="body">
      <div
        v-if="isModalOpen && selectedVacancy"
        class="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-3 sm:p-5 backdrop-blur-xs"
        @click.self="closeVacancyApplyModal"
      >
        <div class="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl text-[#173b2b]">
          <!-- Close Button -->
          <button
            type="button"
            class="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition text-sm font-bold"
            @click="closeVacancyApplyModal"
          >
            ✕
          </button>

          <!-- Modal Scrollable Content -->
          <div class="overflow-y-auto p-5 sm:p-8">
            <!-- Summary Header Block -->
            <div class="summary rounded-xl border border-[#dce8d7] mb-6">
              <div class="job-discriptions">
                <h5 class="dis">Position: <span class="value">{{ selectedVacancy.position_name }}</span></h5>
                <h5 class="dis">Company: <span class="value">{{ selectedVacancy.company }}</span></h5>
                <h5 class="dis">Location: <span class="value">{{ selectedVacancy.locations.join(', ') }}</span></h5>
                <h5 class="dis">Deadline: <span class="value">{{ formatDate(selectedVacancy.deadline) }}</span></h5>
                <h5 class="dis">Salary: <span class="value">{{ selectedVacancy.salary }}</span></h5>
              </div>
            </div>

            <!-- Success State -->
            <div v-if="submitSuccess" class="py-10 text-center">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
                ✓
              </div>
              <h3 class="mt-4 font-serif text-2xl font-bold text-[#173b2b]">Application Submitted!</h3>
              <p class="mt-2 text-sm text-[#66816b] max-w-md mx-auto">
                Thank you for applying for <span class="font-semibold text-[#173b2b]">{{ selectedVacancy.position_name }}</span>. Our recruitment committee will review your qualifications and contact you.
              </p>
              <button
                type="button"
                class="mt-6 rounded-full bg-[#173b2b] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#28593a] transition"
                @click="closeVacancyApplyModal"
              >
                Close
              </button>
            </div>

            <!-- Application Form with Vueform -->
            <div v-else class="py-2">
              <div v-if="submitError" class="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                {{ submitError }}
              </div>
              <ClientOnly>
                <Vueform :endpoint="applyVacancy" :key="selectedVacancy?.id || 'apply'">
                  <StaticElement
                    name="h3"
                    tag="h3"
                    content="Personal Information"
                    size="sm"
                  />
                  <StaticElement
                    name="p"
                    tag="p"
                    content="<div>Full Name *</div>"
                    :columns="{ container: 4 }"
                    size="sm"
                  />
                  <TextElement
                    name="fullName"
                    :columns="{ container: 8 }"
                    :rules="['required']"
                    size="sm"
                  />
                  <StaticElement
                    name="p_1"
                    tag="p"
                    content="<div>Phone Number *</div>"
                    :columns="{ container: 4 }"
                    size="sm"
                  />
                  <PhoneElement
                    name="phoneNumber"
                    :allow-incomplete="true"
                    :unmask="true"
                    :columns="{ container: 8 }"
                    :rules="['required']"
                    size="sm"
                  />
                  <StaticElement
                    name="p_2"
                    tag="p"
                    content="<div>Email Address</div>"
                    :columns="{ container: 4 }"
                    size="sm"
                  />
                  <TextElement
                    name="email"
                    input-type="email"
                    :rules="['nullable', 'email']"
                    :columns="{ container: 8 }"
                    size="sm"
                  />
                  <StaticElement
                    name="p_3"
                    tag="p"
                    content="<div>Work Experience *</div>"
                    :columns="{ container: 4 }"
                    size="sm"
                  />
                  <TextElement
                    name="workExperience"
                    :rules="['required']"
                    :columns="{ container: 8 }"
                    size="sm"
                  />
                  <StaticElement
                    name="p_4"
                    tag="p"
                    content="<div>Gender *</div>"
                    :columns="{ container: 4 }"
                    size="sm"
                  />
                  <RadiogroupElement
                    name="gender"
                    view="tabs"
                    :items="[
                      { value: 'male', label: 'male' },
                      { value: 'female', label: 'female' }
                    ]"
                    default="male"
                    :rules="['required']"
                    :columns="{ container: 8 }"
                    size="sm"
                  />
                  <StaticElement
                    name="p_5"
                    tag="p"
                    content="<div>Languages *</div>"
                    :columns="{ container: 4 }"
                    size="sm"
                  />
                  <TagsElement
                    name="languages"
                    :close-on-select="false"
                    :items="[
                      'Amharic',
                      'English',
                      'Tigrigna',
                      'Afaan Oromo',
                      'Somali'
                    ]"
                    :search="true"
                    :create="true"
                    :default="['Amharic', 'English']"
                    :columns="{ container: 8 }"
                    size="sm"
                  />
                  <StaticElement
                    name="p_6"
                    tag="p"
                    content="<div>Skills *</div>"
                    :columns="{ container: 4 }"
                    size="sm"
                  />
                  <TagsElement
                    name="skill"
                    :close-on-select="false"
                    :items="[
                      'basic computer skill',
                      'microsoft word',
                      'microsoft excel',
                      'inventory tracking',
                      'quality assurance',
                      'customer relations'
                    ]"
                    :search="true"
                    :create="true"
                    :default="['basic computer skill', 'microsoft word']"
                    :columns="{ container: 8 }"
                    size="sm"
                  />
                  <StaticElement
                    name="h3_1"
                    tag="h3"
                    content="Work Experience Information"
                    size="sm"
                  />
                  <ListElement
                    name="workExperienceInformation"
                    :initial="0"
                    add-label="+ Add Experience History"
                    size="sm"
                  >
                    <template #default="{ index }">
                      <ObjectElement :name="index">
                        <TextElement
                          name="position"
                          placeholder="Position"
                          :columns="{ container: 6 }"
                          :rules="['required']"
                          size="sm"
                        />
                        <TextElement
                          name="employerName"
                          placeholder="Employer / Company Name"
                          :columns="{ container: 6 }"
                          :rules="['required']"
                          size="sm"
                        />
                        <TextareaElement
                          name="dutiesDescription"
                          placeholder="Description of duties..."
                          :columns="{ container: 6 }"
                          :rules="['required']"
                          size="sm"
                        />
                        <TextElement
                          name="employerContact"
                          placeholder="HR / Supervisor Contact"
                          :columns="{ container: 6 }"
                          size="sm"
                        />
                      </ObjectElement>
                    </template>
                  </ListElement>
                  <StaticElement
                    name="h3_2"
                    tag="h3"
                    content="File Attachments (Resume / CV)"
                    size="sm"
                  />
                  <MultifileElement
                    name="uploaded_files"
                    :drop="true"
                    field-name="uploaded_files"
                    :urls="{}"
                    size="sm"
                    info="Attach your CV or certificates (.pdf, .doc, .docx)"
                    accept=".pdf,.doc,.docx"
                    :upload-temp-endpoint="false"
                  />
                  <ButtonElement
                    name="submit"
                    button-label="Apply for Position"
                    :submits="true"
                    :full="true"
                  />
                </Vueform>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <SiteFooter />
  </div>
</template>

<style scoped>
/* Main container */
.job-container {
  max-width: 860px;
  min-height: 400px;
  margin: 0 auto;
  margin-bottom: 4rem;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e7eee5;
}

/* Header */
.job-header {
  text-transform: capitalize;
  text-align: center;
  padding-bottom: 12px;
  margin: 2rem auto;
  border-bottom: 1px solid #ddd;
  font-weight: 600;
  font-size: 1.5rem;
  color: #173b2b;
}

.job-header.no-border {
  border: none;
  font-size: 1.1rem;
  color: #66816b;
}

/* Job details */
.job-details {
  padding: 0 1rem 1.5rem 1rem;
}

/* Section styling */
.section {
  border: 1px solid #dfe9da;
  border-radius: 8px;
  margin: 1.25rem 0;
  overflow: hidden;
  background-color: #fff;
}

/* Collapsible sections */
details {
  width: 100%;
}

details summary {
  padding: 14px 20px;
  background-color: #f8f8fa;
  font-weight: bold;
  cursor: pointer;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: background-color 0.2s ease;
}

details summary:hover {
  background-color: #f1f4f0;
}

details summary::after {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1.5rem;
  content: '+';
  font-size: 26px;
  font-weight: 300;
  color: #35653c;
}

details[open] summary::after {
  content: '-';
}

details summary::-webkit-details-marker {
  display: none;
}

.content {
  padding: 20px;
  border-top: 1px solid #edf2eb;
}

.summary {
  padding: 12px 16px;
  background-color: #f8f8fa;
  font-weight: bold;
  border-radius: 6px;
}

.job-discriptions {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .dis {
    text-transform: capitalize;
    color: #0a1525;
    font-size: 13px;
    font-weight: 600;
  }

  .value {
    font-size: 13px;
    font-weight: 400;
    color: #555;
  }
}

/* Apply button */
.apply-button {
  text-align: center;
  padding: 20px 0 10px 0;
}

.apply-button button {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 6px;
  color: white;
  background: linear-gradient(135deg, #0a1525 0%, #152a4a 100%);
  outline: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 10px 2px rgba(21, 42, 74, 0.25);
    transform: translateY(-1px);
  }
}

.quill-html-content :deep(p) {
  margin-bottom: 0.5rem;
}
</style>
