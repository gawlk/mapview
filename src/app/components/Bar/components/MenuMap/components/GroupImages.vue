<template>
  <div v-if="store.project?.images.length > 0" class="flex space-x-2">
    <Menu full :icon="CollectionIcon" :buttonText="t('Open image list')">
      <div
        v-for="image of store.project?.images"
        :key="image.sourceId"
        class="flex space-x-1"
      >
        <MenuItem truncate>
          {{ image.sourceId.split('.')[0] }}
        </MenuItem>
        <MenuItem :icon="SunIcon" />
        <MenuItem :icon="TrashIcon" />
      </div>
    </Menu>
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
    SunIcon,
    TrashIcon,
  } from '@heroicons/vue/solid'

  import { Button, Menu, MenuItem } from '/src/components'

  const { t } = useI18n()

  const inputFile = ref()

  const addImage = async (imageFile: File) => {
    if (imageFile && store.project && store.map) {
      const image = await createImageMap(store.map, imageFile)

      store.project.images = [...store.project.images, image]

      if (store.project.areImagesVisible) {
        image.addToMap()
      }
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
