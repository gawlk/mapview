<template>
  <div class="w-full">
    <Button
      @click="open"
      full
      :leftIcon="props.buttonIcon"
      :rightIcon="ChevronRightIcon"
      :blue="props.buttonBlue"
    >
      <slot name="button" />
    </Button>
    <TransitionRoot appear :show="state.isOpen" as="template">
      <Dialog
        as="div"
        @close="close"
        class="fixed inset-0 z-10 min-h-screen overflow-y-auto text-center"
      >
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-black bg-opacity-10" />
        </TransitionChild>

        <span class="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>

        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <div
            class="inline-flex flex-col justify-center w-full min-h-full p-4 space-y-8 text-left align-middle transition-all transform bg-white shadow-xl  sm:min-h-0 sm:max-w-lg sm:my-8 sm:p-8 sm:rounded-2xl sm:border-2 sm:border-gray-100"
          >
            <DialogTitle as="h3" class="pl-4 text-2xl font-medium leading-6">
              {{ props.title }}
            </DialogTitle>

            <div>
              <slot name="dialog" />
            </div>

            <div class="flex justify-end space-x-2">
              <Button @click="close" centered>
                {{ t(props.saveable ? 'Cancel' : 'Close') }}
              </Button>
              <Button v-if="props.saveable" @click="save" centered orange>
                {{ t('Save') }}
              </Button>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useI18n } from 'vue-i18n'

  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
  } from '@headlessui/vue'
  import { ChevronRightIcon } from '@heroicons/vue/solid'

  import { Button } from '.'

  const emit = defineEmits<{
    (event: 'close'): void
    (event: 'open'): void
    (event: 'save'): void
  }>()

  const props = defineProps<{
    title: string
    buttonIcon: () => void
    saveable?: boolean
    buttonBlue?: boolean
  }>()

  const state = reactive({
    isOpen: false,
  })

  const { t } = useI18n()

  const close = () => {
    state.isOpen = false
    emit('close')
  }

  const open = () => {
    state.isOpen = true
    emit('open')
  }

  const save = () => {
    close()
    emit('save')
  }
</script>

<i18n lang="yaml">
en:
  'Cancel': 'Cancel'
  'Close': 'Close'
  'Save': 'Save'
fr:
  'Cancel': 'Annuler'
  'Close': 'Fermer'
  'Save': 'Sauvegarder'
</i18n>
