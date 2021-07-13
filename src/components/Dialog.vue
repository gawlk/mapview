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
      <Dialog as="div" @close="close">
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="min-h-screen px-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <DialogOverlay class="fixed inset-0" />
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
                class="
                  inline-block
                  w-full
                  max-w-lg
                  p-8
                  my-8
                  overflow-hidden
                  text-left
                  align-middle
                  transition-all
                  transform
                  bg-white
                  shadow-xl
                  rounded-2xl
                  space-y-8
                "
              >
                <DialogTitle
                  as="h3"
                  class="text-2xl font-medium leading-6 pl-4"
                >
                  {{ props.title }}
                </DialogTitle>

                <div>
                  <slot name="dialog" />
                </div>

                <div class="flex justify-end space-x-2">
                  <Button @click="close" centered>
                    {{ props.saveable ? 'Cancel' : 'Close' }}
                  </Button>
                  <Button v-if="props.saveable" @click="save" centered orange>
                    Save
                  </Button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
  import { defineEmits, defineProps, reactive } from 'vue'

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

  const props = defineProps({
    title: String,
    buttonIcon: Function,
    saveable: Boolean,
    buttonBlue: Boolean,
  })

  const state = reactive({
    isOpen: false,
  })

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
