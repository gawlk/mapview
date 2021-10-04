<template>
  <Overlay :isOpen="props.isOpen">
    <div class="flex p-4 space-x-4 overflow-x-auto sm:px-8">
      <div
        v-for="(screenshot, index) in store.project?.selectedReport
          ?.screenshots"
        class="flex-none space-y-4"
      >
        <img
          :src="screenshot"
          style="height: 70vh"
          class="border-4 border-white rounded-lg"
        />
        <Button
          :leftIcon="TrashIcon"
          @click="store.project?.selectedReport?.screenshots.splice(index, 1)"
          red
        >
          {{ t('Delete') }}
        </Button>
      </div>
    </div>
    <div class="flex space-x-4">
      <Button :leftIcon="LogoutIcon" @click="emit('close')">
        {{ t('Exit') }}
      </Button>
    </div>
  </Overlay>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import { TrashIcon, LogoutIcon } from '@heroicons/vue/solid'

  import { Button, Overlay } from '/src/components'

  const props = defineProps<{
    isOpen: boolean
  }>()

  const emit = defineEmits<{
    (event: 'close'): void
  }>()

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Delete': 'Delete'
fr:
  'Delete': 'Supprimer'
</i18n>
