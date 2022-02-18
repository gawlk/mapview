<script setup lang="ts">
  import store from '/src/store'

  import IconLogout from '~icons/heroicons-solid/logout'
  import IconTrash from '~icons/heroicons-solid/trash'

  const props = defineProps<{
    isOpen: boolean
  }>()

  const emit = defineEmits<{
    (event: 'close'): void
  }>()

  const { t } = useI18n()
</script>

<template>
  <Overlay :isOpen="props.isOpen">
    <div class="flex space-x-4 overflow-x-auto p-4 sm:px-8">
      <div
        v-for="(screenshot, index) in store.projects.selected?.reports.selected
          ?.screenshots"
        class="flex-none space-y-4"
      >
        <img
          :src="screenshot"
          style="height: 70vh"
          class="rounded-lg border-4 border-white"
        />
        <Button
          :leftIcon="IconTrash"
          @click="
            store.projects.selected?.reports.selected?.screenshots.splice(
              index,
              1
            )
          "
          red
        >
          {{ t('Delete') }}
        </Button>
      </div>
    </div>
    <div class="flex space-x-4">
      <Button :leftIcon="IconLogout" @click="emit('close')">
        {{ t('Exit') }}
      </Button>
    </div>
  </Overlay>
</template>
