<script setup lang="ts">
  import store from '/src/store'

  import IconLogout from '~icons/heroicons-solid/logout'
  import IconTrash from '~icons/heroicons-solid/trash'

  import Button from '/src/components/Button.vue'
  import Overlay from '/src/components/Overlay.vue'

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
      <div class="space-y-4 bg-white p-8">
        <p
          class="rounded border-l-4 border-yellow-200 bg-yellow-100 p-2 text-left text-yellow-900"
        >
          <span class="font-bold">{{ `${t('Tip')}${t(':')}` }}</span>
          {{
            t(
              "You can copy a screenshot of the map by either right clicking or tapping with 2 fingers on it and selecting 'Copy'."
            )
          }}
        </p>
        <Button :leftIcon="IconLogout" @click="emit('close')" full>
          {{ t('Exit') }}
        </Button>
      </div>
    </div>
  </Overlay>
</template>

<i18n lang="yaml">
fr:
  "You can copy a screenshot of the map by either right clicking or tapping with 2 fingers on it and selecting 'Copy'.": "Vous pouvez copier une capture de la carte soit en effectuant un clic droit soit en tapant avec deux doigts dessus puis en sélectionnant 'Copier'."
</i18n>
