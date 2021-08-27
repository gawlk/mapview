<template>
  <button
    @click="emit('click')"
    :class="[props.opened && 'text-gray-600']"
    class="flex flex-col items-center justify-center w-full px-2 py-4 text-gray-400 cursor-pointer  hover:text-gray-600 focus:outline-none"
  >
    <component :is="props.icon" class="w-5 h-5" />
    <span class="text-xs font-medium leading-6">{{ props.name }}</span>
  </button>
  <div
    v-if="props.opened"
    class="absolute inset-x-0 bottom-0 z-10 p-2 mb-20 bg-transparent"
  >
    <div class="p-2 space-y-2 bg-white rounded-lg">
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
