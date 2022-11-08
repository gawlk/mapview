<script setup lang="ts">
  import { downloadImage } from '/src/scripts'
  import store from '/src/store'

  import IconLogout from '~icons/heroicons-solid/logout'
  import IconDownload from '~icons/heroicons-solid/download'
  import IconTrash from '~icons/heroicons-solid/trash'

  import Button from '/src/components/Button.vue'
  import Overlay from '/src/components/Overlay.vue'

  const props = defineProps<{
    readonly isOpen: boolean
  }>()

  const emit = defineEmits<{
    (event: 'close'): void
  }>()

  const { t } = useI18n()
</script>

<template>
  <Overlay :isOpen="props.isOpen">
    <div class="flex h-screen w-full flex-col">
      <div class="flex h-full space-x-4 overflow-x-auto p-4 sm:px-8">
        <div
          v-for="(screenshot, index) in store.projects.selected?.reports
            .selected?.screenshots"
          class="flex flex-none flex-col items-center justify-center space-y-4"
        >
          <img
            :src="screenshot"
            class="h-[50vh] rounded-lg border-4 border-white lg:h-[70vh]"
          />
          <div class="space-x-2">
            <Button
              :icon="IconDownload"
              @click="() => downloadImage(screenshot)"
            />
            <Button
              :icon="IconTrash"
              @click="
                store.projects.selected?.reports.selected?.screenshots.splice(
                  index,
                  1
                )
              "
              red
            />
          </div>
        </div>
      </div>
      <div class="space-y-4 bg-white p-8">
        <Button :leftIcon="IconLogout" @click="emit('close')" full>
          {{ t('Exit') }}
        </Button>
      </div>
    </div>
  </Overlay>
</template>
