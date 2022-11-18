<script setup lang="ts">
  const props = defineProps<{
    readonly value: boolean
    readonly icon?: any
    readonly leftIcon?: any
    readonly rightIcon?: any
  }>()

  const emit = defineEmits<{
    (event: 'input', value: boolean): void
  }>()
</script>

<template>
  <div class="ml-2 flex items-center space-x-2 px-2">
    <component
      class="h-5 w-5 text-gray-400 transition-opacity duration-200 ease-in-out"
      v-if="props.icon || props.leftIcon"
      :is="props.icon || props.leftIcon"
      :class="props.value && 'opacity-50'"
    />
    <input
      class="h-5 w-9 cursor-pointer appearance-none rounded-full bg-gray-300 bg-contain bg-left bg-no-repeat transition duration-200 ease-in-out checked:bg-gray-400 checked:bg-right focus:outline-none"
      type="checkbox"
      role="switch"
      @input="(event) => emit('input', (event.target as HTMLInputElement).checked)"
      :checked="props.value"
      style="
        background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-4 -4 8 8%22%3E%3Ccircle r=%223%22 fill=%22%23fff%22/%3E%3C/svg%3E');
      "
    />
    <component
      class="h-5 w-5 text-gray-400 transition-opacity duration-200 ease-in-out"
      v-if="props.rightIcon"
      :is="props.rightIcon"
      :class="!props.value && 'opacity-50'"
    />
  </div>
</template>
