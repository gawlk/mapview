<template>
  <button
    @click="emit('click')"
    :class="[props.opened && 'text-gray-600']"
    class="
      w-full
      flex flex-col
      items-center
      justify-center
      p-4
      cursor-pointer
      text-gray-400
      hover:text-gray-600
      focus:outline-none
    "
  >
    <component :is="props.icon" class="h-5 w-5" />
    <span class="text-sm font-medium leading-6">{{ props.name }}</span>
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

<script setup>
  import { defineEmit, defineProps } from 'vue'

  const emit = defineEmit(['click'])

  const props = defineProps({
    icon: Object | Function,
    name: String,
    opened: Boolean,
  })
</script>
