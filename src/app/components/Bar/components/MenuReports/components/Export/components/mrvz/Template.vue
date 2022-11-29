<script setup lang="ts">
  import localForage from 'localforage'

  import { getBrowserLocale } from '/src/locales'

  import store from '/src/store'

  import { downloadFile, fileToBase64, mrvzExporter } from '/src/scripts'

  import Button from '/src/components/Button.vue'

  const props = defineProps<{
    n: number
  }>()

  const state = reactive({
    file: null as File | null,
  })

  let input: HTMLInputElement | undefined

  const key = computed(
    () => `template${store.projects.selected?.machine}${props.n}`
  )

  onMounted(async () => {
    const file: any = await localForage.getItem(key.value)

    if (file) {
      const res = await fetch(file.data64)
      const blob = await res.blob()

      state.file = new File([blob], file.name)
    }
  })

  const updateFile = async (file: File | undefined) => {
    if (file) {
      state.file = file

      await localForage.setItem(key.value, {
        name: file.name,
        data64: await fileToBase64(file),
      })
    }
  }

  const fetchExcel = async () => {
    if (store.projects.selected && state.file) {
      const zip = await mrvzExporter.export(store.projects.selected, state.file)

      downloadFile(zip)

      const res = await fetch(
        `https://mvreport.azurewebsites.net/api/getreport?local=${getBrowserLocale()}`,
        {
          method: 'POST',
          headers: {
            'content-type': 'octet-stream',
            'x-functions-key':
              'v7IwtPEOA8etaIi-CnqPsWE749uRZRKL31iuTTi6n8tIAzFuE_220w==',
          },
          body: zip,
        }
      )

      const file = new File(
        [await res.blob()],
        `${store.projects.selected.reports.selected?.name.toString()}.xlsx`
      )

      downloadFile(file)
    }
  }
</script>

<template>
  <div class="flex space-x-2">
    <button
      class="flex-1 overflow-hidden text-ellipsis rounded-lg border-2 border-gray-100 px-3 py-2 text-left text-sm font-medium hover:bg-gray-50"
      :class="state.file ? 'bg-gray-100' : 'border-dashed'"
      @click="() => (state.file ? fetchExcel() : input?.click())"
    >
      <span class="opacity-50">Template {{ props.n }}:</span>
      {{ state.file ? state.file.name : 'No File' }}
    </button>
    <input
      class="hidden"
      @change="(event) => updateFile((event.target as HTMLInputElement).files?.[0])"
      accept=".xlsx"
      type="file"
      ref="input"
    />
    <Button
      v-if="state.file"
      @click="() => state.file && downloadFile(state.file)"
    >
      Download
    </Button>
    <Button
      v-if="state.file"
      @click="
        () => {
          state.file = null

          localForage.removeItem(key)
        }
      "
      red
    >
      Trash
    </Button>
  </div>
</template>
