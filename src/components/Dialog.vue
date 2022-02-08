<script setup lang="ts">
  import {
    TransitionRoot,
    TransitionChild,
    Dialog as HeadlessDialog,
    DialogOverlay,
    DialogTitle,
  } from '@headlessui/vue'

  import IconChevronRight from '~icons/heroicons-solid/chevron-right'

  const emit = defineEmits<{
    (event: 'close'): void
    (event: 'open'): void
    (event: 'save'): void
  }>()

  const props = defineProps<{
    title: string
    buttonIcon: any
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

<template>
  <div class="w-full">
    <Button
      @click="open"
      full
      :leftIcon="props.buttonIcon"
      :rightIcon="IconChevronRight"
      :blue="props.buttonBlue"
    >
      <slot name="button" />
    </Button>
    <TransitionRoot appear :show="state.isOpen" as="template">
      <HeadlessDialog
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
            class="inline-flex min-h-full w-full transform flex-col justify-center space-y-8 bg-white p-4 text-left align-middle shadow-xl transition-all sm:my-8 sm:min-h-0 sm:max-w-lg sm:rounded-2xl sm:border-2 sm:border-gray-100 sm:p-8"
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
      </HeadlessDialog>
    </TransitionRoot>
  </div>
</template>
