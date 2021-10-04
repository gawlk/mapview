<template>
  <Overlay :isOpen="props.image !== null">
    <img
      :src="state.image"
      style="max-height: 70vh"
      class="border-4 border-white rounded-lg"
    />
    <div class="flex space-x-4">
      <Button green @click="emit('save')">
        {{ t('Add to album') }}
      </Button>
      <Button red @click="emit('close')">
        {{ t('Exit') }}
      </Button>
    </div>
  </Overlay>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { Button, Overlay } from '/src/components'

  const props = defineProps<{
    image: string | null
  }>()

  const emit = defineEmits<{
    (event: 'close'): void
    (event: 'save'): void
  }>()

  const { t } = useI18n()

  const state = reactive<{
    image: string
  }>({
    image: '',
  })

  watch(
    () => props.image,
    (image) => image && (state.image = image),
    { immediate: true }
  )
</script>

<i18n lang="yaml">
en:
  'Add to album': 'Add to album'
fr:
  'Add to album': "Ajouter à l'album"
</i18n>
