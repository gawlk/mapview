<template>
  <div
    v-if="store.project?.selectedReport?.images.length > 0"
    class="flex space-x-2"
  >
    <Dialog :buttonIcon="PhotographIcon">
      <template v-slot:button>
        {{ t('View the album') }}
      </template>
    </Dialog>
    <Button :icon="CameraIcon" />
  </div>
  <Button v-else full :leftIcon="CameraIcon">
    {{ t('Photograph the map') }}
  </Button>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import { CameraIcon, PhotographIcon } from '@heroicons/vue/solid'

  import { Button, Dialog } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Photograph the map': 'Photograph the map'
  'View the album': 'View the album'
fr:
  'Photograph the map': 'Photographier la carte'
  'View the album': "Voir l'album"
</i18n>
