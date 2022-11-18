<script setup lang="ts">
  const emit = defineEmits<{
    (event: 'click'): void
  }>()

  const props = defineProps<{
    readonly disabled: boolean
    readonly icon: any
    readonly name: string
    readonly opened?: boolean
    readonly style?: string
    readonly class?: string
  }>()
</script>

<template>
  <button
    class="flex w-full flex-col items-center justify-center p-2 text-gray-400 focus:outline-none"
    @click="emit('click')"
    :class="[
      props.disabled
        ? 'cursor-default opacity-25'
        : 'cursor-pointer hover:text-gray-600',
      props.opened && 'text-gray-600',
    ]"
  >
    <component class="h-5 w-5" :is="props.icon" />
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
    <div
      :style="props.style"
      :class="['space-y-2 rounded-lg bg-white p-2', props.class || '']"
    >
      <div class="select-none p-1">
        <hr
          class="mx-auto w-1/6 cursor-pointer rounded-full border-2 border-gray-200"
          @click="emit('click')"
        />
      </div>

      <slot></slot>
    </div>
  </div>
</template>
