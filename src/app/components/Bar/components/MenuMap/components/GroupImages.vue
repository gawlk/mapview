<script setup lang="ts">
  import store from '/src/store'

  import { createOverlay } from '/src/scripts'
  import { convertFileToDataURL } from '/src/scripts'

  import IconCollection from '~icons/heroicons-solid/collection'
  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconPhotograph from '~icons/heroicons-solid/photograph'
  import IconPlus from '~icons/heroicons-solid/plus'
  import IconTrash from '~icons/heroicons-solid/trash'

  import Button from '/src/components/Button.vue'
  import Popover from '/src/components/Popover.vue'

  import Sun0 from '/src/assets/svg/custom/sun0.svg'
  import Sun25 from '/src/assets/svg/custom/sun25.svg'
  import Sun50 from '/src/assets/svg/custom/sun50.svg'
  import Sun75 from '/src/assets/svg/custom/sun75.svg'
  import Sun100 from '/src/assets/svg/custom/sun100.svg'

  const { t } = useI18n()

  const inputFile = ref()

  const addOverlay = async (file?: File) => {
    if (file && store.projects.selected) {
      const data64 = await convertFileToDataURL(file)

      const overlay = await createOverlay(data64, store.map, {
        version: 1,
        name: file.name,
      })

      store.projects.selected.overlays.push(overlay)

      overlay.addToMap(store.projects.selected.settings.areOverlaysVisible)
    }
  }

  const goToOverlay = (overlay: Overlay) => {
    if (!overlay.markerNW || !overlay.markerSE) return

    const nw = overlay.markerNW.getLngLat()
    const se = overlay.markerSE.getLngLat()

    store.map?.fitBounds(
      [
        [nw.lng < se.lng ? nw.lng : se.lng, nw.lat < se.lat ? nw.lat : se.lat], // southwestern corner of the bounds
        [nw.lng > se.lng ? nw.lng : se.lng, nw.lat > se.lat ? nw.lat : se.lat], // northeastern corner of the bounds
      ],
      { padding: 100 }
    )
  }

  const deleteImage = (index: number) => {
    store.projects.selected?.overlays.splice(index, 1)?.[0]?.remove()
  }

  const getSunIcon = (opacity: number) => {
    switch (opacity) {
      case 0:
        return Sun0
      case 0.25:
        return Sun25
      case 0.75:
        return Sun75
      case 1:
        return Sun100
      default:
        return Sun50
    }
  }

  const switchOpacity = (overlay: Overlay) => {
    switch (overlay.opacity) {
      case 0:
        overlay.opacity = 0.25
        break
      case 0.5:
        overlay.opacity = 0.75
        break
      case 0.75:
        overlay.opacity = 1
        break
      case 1:
        overlay.opacity = 0
        break
      default:
        overlay.opacity = 0.5
        break
    }
  }
</script>

<template>
  <div
    class="flex space-x-2"
    v-if="(store.projects.selected?.overlays.length || 0) > 0"
  >
    <Popover :icon="IconCollection" :buttonText="t('Open image list')" full>
      <div
        class="flex space-x-1"
        v-for="(overlay, index) of store.projects.selected?.overlays"
        :key="overlay.id"
      >
        <Button @click="goToOverlay(overlay)" truncate full>
          {{ overlay.id.split('.')[0] }}
        </Button>
        <Button
          :icon="getSunIcon(overlay.opacity)"
          @click="switchOpacity(overlay)"
        />
        <Button :icon="IconTrash" @click="deleteImage(index)" />
      </div>
    </Popover>
    <Button
      @click="
        store.projects.selected &&
          (store.projects.selected.settings.areOverlaysVisible =
            !store.projects.selected.settings.areOverlaysVisible)
      "
      :icon="
        store.projects.selected?.settings.areOverlaysVisible
          ? IconEye
          : IconEyeOff
      "
    />
    <Button @click="inputFile.click()" :icon="IconPlus" />
  </div>
  <Button
    v-else
    full
    @click="inputFile.click()"
    :leftIcon="IconPhotograph"
    :rightIcon="IconPlus"
  >
    {{ t('Add an image') }}
  </Button>
  <input
    class="hidden"
    @change="addOverlay(($event.target as HTMLInputElement).files?.[0])"
    accept="image/*"
    type="file"
    ref="inputFile"
  />
</template>

<i18n lang="yaml">
fr:
  'Add an image': 'Ajouter une image'
  'Open image list': 'Ouvrir la liste des images'
</i18n>
