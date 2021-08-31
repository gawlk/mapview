<template>
  <div v-if="store.project?.images.length > 0" class="flex space-x-2">
    <Popover
      :icon="CollectionIcon"
      :buttonText="t('Open image list')"
      full
      isTop
    >
      <div
        v-for="(image, index) of store.project?.images"
        :key="image.sourceId"
        class="flex space-x-1"
      >
        <Button @click="goToImage(image)" truncate full>
          {{ image.sourceId.split('.')[0] }}
        </Button>
        <Button
          :icon="getSunIcon(image.opacity)"
          @click="switchOpacity(image)"
        />
        <Button :icon="TrashIcon" @click="deleteImage(image, index)" />
      </div>
    </Popover>
    <Button
      @click="store.project.areImagesVisible = !store.project.areImagesVisible"
      :icon="store.project?.areImagesVisible ? EyeIcon : EyeOffIcon"
    />
    <Button @click="inputFile.click()" :icon="PlusIcon" />
  </div>
  <Button
    v-else
    full
    @click="inputFile.click()"
    :leftIcon="PhotographIcon"
    :rightIcon="PlusIcon"
  >
    {{ t('Add an image') }}
  </Button>
  <input
    @change="addImage($event.target.files[0])"
    accept="image/*"
    type="file"
    ref="inputFile"
    class="hidden"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'
  import { createImageMap } from '/src/scripts/map/imageMap'

  import {
    CollectionIcon,
    EyeIcon,
    EyeOffIcon,
    PhotographIcon,
    PlusIcon,
    TrashIcon,
  } from '@heroicons/vue/solid'

  import { Button, Popover } from '/src/components'

  import Sun0 from '/src/assets/svg/custom/sun0.svg'
  import Sun25 from '/src/assets/svg/custom/sun25.svg'
  import Sun50 from '/src/assets/svg/custom/sun50.svg'
  import Sun75 from '/src/assets/svg/custom/sun75.svg'
  import Sun100 from '/src/assets/svg/custom/sun100.svg'

  const { t } = useI18n()

  const inputFile = ref()

  const addImage = async (imageFile: File) => {
    if (imageFile && store.project && store.map) {
      const image = await createImageMap(store.map, imageFile)

      store.project.images = [...store.project.images, image]

      image.addToMap(store.project.areImagesVisible)
    }
  }

  const goToImage = (image: ImageMap) => {
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

  const deleteImage = (image: ImageMap, index: number) => {
    image.remove()

    if (store.project) {
      store.project.images.splice(index, 1)

      store.project.images = [...store.project.images]
    }
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

  const switchOpacity = (image: ImageMap) => {
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

<i18n lang="yaml">
en:
  'Add an image': 'Add an image'
  'Open image list': 'Open image list'
fr:
  'Add an image': 'Ajouter une image'
  'Open image list': 'Ouvrir la liste des images'
</i18n>
