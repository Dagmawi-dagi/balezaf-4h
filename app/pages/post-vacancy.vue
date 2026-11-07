<script setup>
definePageMeta({
  name: 'vacancyPost',
})

const router = useRouter()

const postNewVacancy = async (FormD, form$) => {
  try {
    await $fetch('/api/vacancy', {
      method: 'POST',
      body: form$.data,
      headers: {
        apiref: '/api/vacancy/POST',
      },
    })
    frontEndErrorFeedback().success('new vacancy posted successfully')
    setTimeout(() => {
      router.push('/admin')
    }, 1500)
  } catch (error) {
    frontEndErrorFeedback().err(error)
  }
}
</script>

<template>
  <div class="container py-8 max-w-4xl mx-auto px-4 min-h-screen">
    <div class="mb-6 flex items-center justify-between border-b pb-4">
      <div>
        <NuxtLink to="/admin" class="text-xs text-emerald-800 hover:underline">← Back to Admin</NuxtLink>
        <h1 class="text-xl font-bold text-[#173b2b] mt-1">Post Vacancy</h1>
      </div>
    </div>
    <ClientOnly>
      <Vueform :endpoint="postNewVacancy">
        <StaticElement
          name="h3"
          tag="h3"
          content="Post New Vacancy"
          style="color: #1492E6;"
          bottom="2"
        />
        <StaticElement
          name="p"
          tag="p"
          content="<div>position name</div>"
          :columns="{
            container: 2,
          }"
        />
        <TextElement
          name="position_name"
          :columns="{
            container: 10,
          }"
          :rules="[
            'required',
          ]"
        />
        <StaticElement
          name="p_1"
          tag="p"
          content="<div>company</div>"
          :columns="{
            container: 2,
          }"
        />
        <TextElement
          name="company"
          :columns="{
            container: 10,
          }"
          :rules="[
            'required',
          ]"
        />
        <StaticElement
          name="p_3"
          tag="p"
          content="<div>salary</div>"
          :columns="{
            container: 2,
          }"
        />
        <TextElement
          name="salary"
          :columns="{
            container: 10,
          }"
          :rules="[
            'required',
          ]"
        />
        <StaticElement
          name="p_2"
          tag="p"
          content="<div>location</div>"
          :columns="{
            container: 2,
          }"
        />
        <TagsElement
          name="locations"
          :close-on-select="false"
          :search="true"
          :items="[
            {
              value: 'Addis Ababa',
              label: 'Addis Ababa',
            },
            {
              value: 'Hawassa',
              label: 'Hawassa',
            },
            {
              value: 'Bahir Dar',
              label: 'Bahir Dar',
            },
            {
              value: 'mekelle',
              label: 'mekelle',
            },
            {
              value: 'quiha',
              label: 'quiha',
            },
            {
              value: 'ayder',
              label: 'ayder',
            },
          ]"
          input-type="search"
          autocomplete="off"
          :columns="{
            container: 10,
          }"
          :create="true"
          :add-option-on="[
            'enter',
            ',',
          ]"
          :rules="[
            'required',
          ]"
        />
        <TextareaElement
          name="description"
          label="description"
          :rules="[
            'required',
          ]"
        />
        <EditorElement
          name="requirements"
          label="requirements"
          :rules="[
            'required',
          ]"
        />
        <DateElement
          name="deadline"
          label="deadline"
          size="sm"
          :rules="[
            'required',
          ]"
          :columns="{
            container: 4,
          }"
        />
        <ButtonElement
          name="post"
          button-label="Post New Vacancy"
          :submits="true"
          align="center"
          size="sm"
          :columns="{
            container: 10,
          }"
        />
      </Vueform>
    </ClientOnly>
  </div>
</template>

<style scoped>
.container {
  width: min(90%, 1000px);
  margin: 0 auto;
  padding: 1.5rem 10px;
}
</style>
