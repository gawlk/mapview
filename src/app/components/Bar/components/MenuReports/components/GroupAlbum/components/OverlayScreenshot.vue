<script setup lang="ts">
  const props = defineProps<{
    image: string | null
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
  <Overlay :isOpen="props.image !== null">
    <img
      :src="state.image"
      class="max-h-[70vh] rounded-lg border-4 border-white"
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

<i18n lang="yaml">
fr:
  'Add to album': "Ajouter à l'album"
</i18n>
