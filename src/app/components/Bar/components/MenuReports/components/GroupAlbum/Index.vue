<template>
  <div class="flex space-x-2">
    <div
      v-if="(store.project?.selectedReport?.screenshots.length || 0) > 0"
      class="flex w-full space-x-2"
    >
      <Button
        :leftIcon="PhotographIcon"
        :rightIcon="ChevronRightIcon"
        full
        @click="state.isAlbumOpen = true"
      >
        {{ t('View the album') }}
      </Button>
      <OverlayAlbum
        :isOpen="state.isAlbumOpen"
        @close="state.isAlbumOpen = false"
      />
      <Button :icon="CameraIcon" @click="screenshot" />
    </div>
    <Button
      v-else
      full
      :leftIcon="CameraIcon"
      :rightIcon="ChevronRightIcon"
      @click="screenshot"
    >
      {{ t('Photograph the map') }}
    </Button>
    <Button :icon="PlusIcon" @click="file.click()">
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

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import html2canvas from 'html2canvas'

  import store from '/src/store'
  import { fileToBase64 } from '/src/scripts'

  import {
    CameraIcon,
    ChevronRightIcon,
    PhotographIcon,
    PlusIcon,
  } from '@heroicons/vue/solid'

  import { Button } from '/src/components'
  import OverlayAlbum from './components/OverlayAlbum.vue'
  import OverlayScreenshot from './components/OverlayScreenshot.vue'

  const { t } = useI18n()

  const state = reactive<{
    image: string | null
    isAlbumOpen: boolean
  }>({
    image: null,
    isAlbumOpen: false,
  })

  const file = ref()

  watch(
    () => store.project?.selectedReport?.screenshots.length,
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
      store.project?.selectedReport?.screenshots.push(state.image)

      state.image = null
    }
  }

  const importScreenshots = (files: FileList | null) => {
    Array.from(files || []).forEach(async (file: File) => {
      store.project?.selectedReport?.screenshots.push(await fileToBase64(file))
    })
  }
</script>

<i18n lang="yaml">
en:
  'Photograph the map': 'Photograph the map'
  'Album': 'Album'
  'View the album': 'View the album'
fr:
  'Photograph the map': 'Photographier la carte'
  'Album': 'Album'
  'View the album': "Voir l'album"
</i18n>
