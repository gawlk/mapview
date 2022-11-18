<script setup lang="ts">
  import IconX from '~icons/heroicons-solid/x'

  import Button from '/src/components/Button.vue'

  const emit = defineEmits<{
    (event: 'close'): void
  }>()
</script>

<template>
  <div class="fixed inset-x-0 top-0 z-10 bg-orange-600">
    <div class="flex w-full items-center py-1.5 px-3 sm:px-5 lg:px-7">
      <div class="w-full pr-16 sm:px-16 sm:text-center">
        <p class="font-medium text-white">
          <slot />
        </p>
      </div>

      <button
        class="flex rounded-md p-2 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-white"
        @click="() => emit('close')"
        type="button"
      >
        <span class="sr-only">Dismiss</span>
        <IconX class="h-5 w-5 text-white" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
