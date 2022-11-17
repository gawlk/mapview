<script setup lang="ts">
  import html2canvas from 'html2canvas'

  import store from '/src/store'

  import { fileToBase64 } from '/src/scripts'

  import IconArrowSmRight from '~icons/heroicons-solid/arrow-sm-right'
  import IconCamera from '~icons/heroicons-solid/camera'
  import IconPhotograph from '~icons/heroicons-solid/photograph'
  import IconPlus from '~icons/heroicons-solid/plus'

  import Button from '/src/components/Button.vue'

  import OverlayAlbum from './components/OverlayAlbum.vue'
  import OverlayScreenshot from './components/OverlayScreenshot.vue'

  const { t } = useI18n()

  const state = reactive({
    image: null as string | null,
    isAlbumOpen: false,
    screenshooting: false,
  })

  const file = ref()

  watch(
    () => store.projects.selected?.reports.selected?.screenshots.length,
    (length) => length === 0 && (state.isAlbumOpen = false)
  )

  const screenshot = async () => {
    state.screenshooting = true

    const map: HTMLElement = document.getElementById('map') as HTMLElement

    map
      .getElementsByClassName('mapboxgl-control-container')[0]
      .classList.add('hidden')

    Array.from(map.getElementsByClassName('mapview-icon')).forEach((icon) => {
      ;(icon as HTMLSpanElement).style.marginBottom = '1rem'
    })

    const canvasFrom = await html2canvas(map, {
      logging: false,
    })

    state.image = canvasFrom.toDataURL()

    Array.from(map.getElementsByClassName('mapview-icon')).forEach((icon) => {
      ;(icon as HTMLSpanElement).style.marginBottom = ''
    })

    map
      .getElementsByClassName('mapboxgl-control-container')[0]
      .classList.remove('hidden')

    state.screenshooting = false
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
        <span class="text-gray-500"
          >({{
            store.projects.selected?.reports.selected?.screenshots.length
          }})</span
        >
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
    <div
      v-if="state.screenshooting"
      class="fixed inset-0 z-50 bg-black bg-opacity-10"
    />
  </div>
</template>

<i18n lang="yaml">
fr:
  'Photograph the map': 'Photographier la carte'
  'View the album': "Voir l'album"
</i18n>
