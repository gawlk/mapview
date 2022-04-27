<script setup lang="ts">
  import html2canvas from 'html2canvas'

  import store from '/src/store'
  import { fileToBase64 } from '/src/scripts'

  import IconCamera from '~icons/heroicons-solid/camera'
  import IconArrowSmRight from '~icons/heroicons-solid/arrow-sm-right'
  import IconPhotograph from '~icons/heroicons-solid/photograph'
  import IconPlus from '~icons/heroicons-solid/plus'

  import OverlayAlbum from './components/OverlayAlbum.vue'
  import OverlayScreenshot from './components/OverlayScreenshot.vue'

  const { t } = useI18n()

  const state = reactive({
    image: null as string | null,
    isAlbumOpen: false,
  })

  const file = ref()

  watch(
    () => store.projects.selected?.reports.selected?.screenshots.length,
    (length) => length === 0 && (state.isAlbumOpen = false)
  )

  const screenshot = async () => {
    const map: HTMLElement = document.getElementById('map') as HTMLElement

    map
      .getElementsByClassName('mapboxgl-control-container')[0]
      .classList.add('hidden')

    state.image = (await html2canvas(map, { logging: false })).toDataURL()

    map
      .getElementsByClassName('mapboxgl-control-container')[0]
      .classList.remove('hidden')
  }

  const save = () => {
    if (state.image) {
      store.projects.selected?.reports.selected?.screenshots.push(state.image)

      state.image = null
    }
  }

  const importScreenshots = (files: FileList | null) => {
    Array.from(files || []).forEach(async (file: File) => {
      store.projects.selected?.reports.selected?.screenshots.push(
        await fileToBase64(file)
      )
    })
  }
</script>

<template>
  <div class="flex space-x-2">
    <div
      v-if="
        (store.projects.selected?.reports.selected?.screenshots.length || 0) > 0
      "
      class="flex w-full space-x-2"
    >
      <Button
        :leftIcon="IconPhotograph"
        :rightIcon="IconArrowSmRight"
        full
        @click="state.isAlbumOpen = true"
      >
        {{ t('View the album') }}
      </Button>
      <OverlayAlbum
        :isOpen="state.isAlbumOpen"
        @close="state.isAlbumOpen = false"
      />
      <Button :icon="IconCamera" @click="screenshot" />
    </div>
    <Button
      v-else
      full
      :leftIcon="IconCamera"
      :rightIcon="IconArrowSmRight"
      @click="screenshot"
    >
      {{ t('Photograph the map') }}
    </Button>
    <Button :icon="IconPlus" @click="file.click()">
      {{ t('Import an image') }}
    </Button>
    <input
      @change="importScreenshots(($event.target as HTMLInputElement).files)"
      accept="image/png, image/jpeg"
      type="file"
      ref="file"
      class="hidden"
      multiple
    />
    <OverlayScreenshot
      :image="state.image"
      @close="state.image = null"
      @save="save"
    />
  </div>
</template>

<i18n lang="yaml">
fr:
  'Photograph the map': 'Photographier la carte'
  'View the album': "Voir l'album"
</i18n>
