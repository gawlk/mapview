<script setup lang="ts">
  import store from '/src/store'
  import { createImage } from '/src/scripts'
  import { fileToBase64 } from '/src/scripts'

  import IconCollection from '~icons/heroicons-solid/collection'
  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconPhotograph from '~icons/heroicons-solid/photograph'
  import IconTrash from '~icons/heroicons-solid/trash'
  import IconPlus from '~icons/heroicons-solid/plus'
  import Sun0 from '/src/assets/svg/custom/sun0.svg'
  import Sun25 from '/src/assets/svg/custom/sun25.svg'
  import Sun50 from '/src/assets/svg/custom/sun50.svg'
  import Sun75 from '/src/assets/svg/custom/sun75.svg'
  import Sun100 from '/src/assets/svg/custom/sun100.svg'

  import Button from '/src/components/Button.vue'
  import Popover from '/src/components/Popover.vue'

  const { t } = useI18n()

  const inputFile = ref()

  const addImage = async (file?: File) => {
    if (file && store.projects.selected) {
      const data64 = await fileToBase64(file)

      const image = await createImage(data64, store.map, {
        name: file.name,
      })

      store.projects.selected.images.push(image)

      image.addToMap(store.projects.selected.settings.areImagesVisible)
    }
  }

  const goToImage = (image: Image) => {
    const nw = image.markerNW.getLngLat()
    const se = image.markerSE.getLngLat()

    store.map?.fitBounds(
      [
        [nw.lng < se.lng ? nw.lng : se.lng, nw.lat < se.lat ? nw.lat : se.lat], // southwestern corner of the bounds
        [nw.lng > se.lng ? nw.lng : se.lng, nw.lat > se.lat ? nw.lat : se.lat], // northeastern corner of the bounds
      ],
      { padding: 100 }
    )
  }

  const deleteImage = (index: number) => {
    const image = store.projects.selected?.images.splice(index, 1)?.[0]

    image?.remove()
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

  const switchOpacity = (image: Image) => {
    switch (image.opacity) {
      case 0:
        image.opacity = 0.25
        break
      case 0.5:
        image.opacity = 0.75
        break
      case 0.75:
        image.opacity = 1
        break
      case 1:
        image.opacity = 0
        break
      default:
        image.opacity = 0.5
        break
    }
  }
</script>

<template>
  <div
    v-if="(store.projects.selected?.images.length || 0) > 0"
    class="flex space-x-2"
  >
    <Popover :icon="IconCollection" :buttonText="t('Open image list')" full>
      <div
        v-for="(image, index) of store.projects.selected?.images"
        :key="image.id"
        class="flex space-x-1"
      >
        <Button @click="goToImage(image)" truncate full>
          {{ image.id.split('.')[0] }}
        </Button>
        <Button
          :icon="getSunIcon(image.opacity)"
          @click="switchOpacity(image)"
        />
        <Button :icon="IconTrash" @click="deleteImage(index)" />
      </div>
    </Popover>
    <Button
      @click="
        store.projects.selected &&
          (store.projects.selected.settings.areImagesVisible =
            !store.projects.selected.settings.areImagesVisible)
      "
      :icon="
        store.projects.selected?.settings.areImagesVisible
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
    @change="addImage(($event.target as HTMLInputElement).files?.[0])"
    accept="image/*"
    type="file"
    ref="inputFile"
    class="hidden"
  />
</template>

<i18n lang="yaml">
fr:
  'Add an image': 'Ajouter une image'
  'Open image list': 'Ouvrir la liste des images'
</i18n>
