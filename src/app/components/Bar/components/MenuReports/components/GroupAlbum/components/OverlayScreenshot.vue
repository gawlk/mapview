<script setup lang="ts">
  import { downloadImage } from '/src/scripts'

  import Button from '/src/components/Button.vue'
  import Overlay from '/src/components/Overlay.vue'

  const props = defineProps<{
    readonly image: string | null
  }>()

  const emit = defineEmits<{
    (event: 'close'): void
    (event: 'save'): void
  }>()

  const { t } = useI18n()

  const state = reactive({
    image: '',
  })

  watch(
    () => props.image,
    (image) => image && (state.image = image)
  )
</script>

<template>
  <Overlay :isOpen="!!props.image">
    <img
      class="max-h-[70vh] rounded-lg border-4 border-white"
      :src="state.image"
    />
    <div class="flex space-x-4">
      <Button green @click="emit('save')">
        {{ t('Add to album') }}
      </Button>
      <Button
        yellow
        @click="
          () => {
            downloadImage(state.image)
            emit('close')
          }
        "
      >
        {{ t('Download picture') }}
      </Button>
      <Button red @click="emit('close')">
        {{ t('Exit') }}
      </Button>
    </div>
  </Overlay>
</template>

<i18n lang="yaml">
fr:
  'Add to album': "Ajouter à l'album"
  'Download picture': "Télécharger l'image"
</i18n>
