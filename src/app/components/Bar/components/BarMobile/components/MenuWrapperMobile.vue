<template>
  <button
    @click="emit('click')"
    :class="[
      props.disabled
        ? 'opacity-25 cursor-default'
        : 'hover:text-gray-600 cursor-pointer',
      props.opened && 'text-gray-600',
    ]"
    class="flex flex-col items-center justify-center w-full p-2 text-gray-400  focus:outline-none"
  >
    <component :is="props.icon" class="w-5 h-5" />
    <span class="text-xs font-medium leading-6">
      {{ props.name }}
    </span>
  </button>
  <div
    v-if="props.opened"
    class="absolute inset-x-0 bottom-0 z-10 mb-20 bg-transparent"
  >
    <div class="p-2 space-y-2 bg-white rounded-lg">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    (event: 'click'): void
  }>()

  const props = defineProps<{
    disabled: boolean
    icon: () => any
    name: string
    opened?: boolean
  }>()
</script>
