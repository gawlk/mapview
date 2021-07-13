<template>
  <div v-if="store.project?.images.length > 0" class="flex space-x-2">
    <Listbox
      full
      :icon="CollectionIcon"
      :selectedReplacement="t('Open image list')"
      :values="store.project?.images.map((image) => image.id.split('.')[0])"
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
    @change="addImageToMap($event.target.files[0])"
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
    PhotographIcon,
    PlusIcon,
  } from '@heroicons/vue/solid'

  import { Button, Listbox } from '/src/components'

  const { t } = useI18n()

  const inputFile = ref()

  const addImageToMap = async (imageFile: File) => {
    if (imageFile && store.project && store.map) {
      store.project.images = [
        ...store.project.images,
        await createImageMap(store.map, imageFile),
      ]
      console.log(store.project.images)
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
