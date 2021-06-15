<template>
  <Button
    v-if="store.project?.images.length === 0"
    full
    @click="inputFile.click()"
    :leftIcon="PhotographIcon"
    :rightIcon="PlusIcon"
  >
    {{ t('Add an image') }}
  </Button>
  <div v-else class="flex space-x-2">
    <Listbox full />
    <Button @click="inputFile.click()" :icon="PlusIcon" />
    <Button :icon="CogIcon" />
  </div>
  <input
    @change="addImageToMap($event.target.files[0])"
    accept="image/*"
    type="file"
    ref="inputFile"
    class="hidden"
  />
</template>

<script setup>
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'
  import { createImageMap } from '/src/scripts/map/imageMap'

  import { CogIcon, PhotographIcon, PlusIcon } from '@heroicons/vue/solid'

  import { Button, Listbox } from '/src/components'

  const { t } = useI18n()

  ref: inputFile

  const addImageToMap = async (imageFile) => {
    if (imageFile) {
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
fr:
  'Add an image': 'Ajouter une image'
</i18n>
