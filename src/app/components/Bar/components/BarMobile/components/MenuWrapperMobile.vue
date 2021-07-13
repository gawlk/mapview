<template>
  <button
    @click="emit('click')"
    :class="[props.opened && 'text-gray-600']"
    class="
      w-full
      flex flex-col
      items-center
      justify-center
      px-2
      py-4
      cursor-pointer
      text-gray-400
      hover:text-gray-600
      focus:outline-none
    "
  >
    <component :is="props.icon" class="h-5 w-5" />
    <span class="text-xs font-medium leading-6">{{ props.name }}</span>
  </button>
  <div
    v-if="props.opened"
    class="absolute bg-transparent bottom-0 inset-x-0 mb-20 z-10 p-2"
  >
    <div class="bg-white rounded-lg p-2 space-y-2">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineEmits, defineProps } from 'vue'

  const emit = defineEmits<{
    (event: 'click'): void
  }>()

  const props = defineProps<{
    icon: () => any
    name: string
    opened: boolean
  }>()
</script>
