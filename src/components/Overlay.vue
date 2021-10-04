<template>
  <TransitionRoot appear :show="state.isOpen" as="template">
    <Dialog
      as="div"
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
          class="inline-flex flex-col items-center justify-center w-full min-h-0 space-y-8 align-middle transition-all transform "
        >
          <slot />
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue'

  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
  } from '@headlessui/vue'

  const props = defineProps<{
    isOpen: boolean
  }>()

  const state = reactive({
    isOpen: false,
  })

  const open = () => {
    state.isOpen = true
  }

  const close = () => {
    state.isOpen = false
  }

  watch(
    () => props.isOpen,
    (isOpen) => (isOpen ? open() : close())
  )
</script>
