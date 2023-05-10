<script setup lang="ts">
  import localForage from 'localforage'
  import type { Component } from 'vue'

  import store from '/src/store'

  import { convertFileToDataURL, downloadFile } from '/src/scripts'

  import { getTemplateKey } from './scripts'

  import Button from '/src/components/Button.vue'

  import Rest from './Rest.vue'

  const { t } = useI18n()

  const emit = defineEmits<{
    (event: 'component', value: Component, props?: any): void
  }>()

  const props = defineProps<{
    n: 1 | 2 | 3
  }>()

  const state = reactive({
    file: null as File | null,
  })

  const input = ref(undefined as HTMLInputElement | undefined)

  const key = computed(() =>
    getTemplateKey(store.projects.selected?.machine as MachineName, props.n)
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
        data64: await convertFileToDataURL(file),
      })
    }
  }

  const remove = () => {
    state.file = null

    localForage.removeItem(key.value)
  }
</script>

<template>
  <div class="flex space-x-2">
    <button
      class="flex-1 overflow-hidden text-ellipsis rounded-lg border-2 border-gray-100 px-3 py-2 text-left text-sm font-medium hover:bg-gray-50"
      :class="state.file ? 'bg-gray-100' : 'border-dashed'"
      @click="
        () =>
          state.file
            ? emit('component', Rest, {
                project: store.projects.selected,
                template: state.file,
              })
            : input?.click()
      "
    >
      <span class="opacity-50">{{ t('Template') }} {{ props.n }}:</span>
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
      {{ t('Download') }}
    </Button>
    <Button v-if="state.file" @click="remove" red> {{ t('Delete') }} </Button>
  </div>
</template>
