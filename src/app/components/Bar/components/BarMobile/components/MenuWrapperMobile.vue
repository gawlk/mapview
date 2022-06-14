<script setup lang="ts">
  const emit = defineEmits<{
    (event: 'click'): void
  }>()

  const props = defineProps<{
    disabled: boolean
    icon: any
    name: string
    opened?: boolean
  }>()
</script>

<template>
  <button
    @click="emit('click')"
    :class="[
      props.disabled
        ? 'cursor-default opacity-25'
        : 'cursor-pointer hover:text-gray-600',
      props.opened && 'text-gray-600',
    ]"
    class="flex w-full flex-col items-center justify-center p-2 text-gray-400 focus:outline-none"
  >
    <component :is="props.icon" class="h-5 w-5" />
    <span class="text-xs font-medium leading-6">
      {{ props.name }}
    </span>
  </button>
  <div
    :class="[
      !props.opened && 'hidden',
      'absolute inset-x-0 bottom-0 z-10 mb-[4.75rem] bg-transparent',
    ]"
  >
    <!-- style="max-height: 75vh; max-height: 75dvh" -->
    <div class="space-y-2 rounded-lg bg-white p-2">
      <div class="select-none p-1">
        <hr
          @click="emit('click')"
          class="mx-auto w-1/6 cursor-pointer rounded-full border-2 border-gray-200"
        />
      </div>

      <slot></slot>
    </div>
  </div>
</template>
