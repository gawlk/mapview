<script setup lang="ts">
  const props = defineProps<{
    readonly text: string
    readonly icon?: any
  }>()
</script>

<template>
  <div>
    <div
      class="group flex w-full items-center justify-between rounded-t-lg bg-gray-100 px-4 py-2 text-sm font-medium leading-6"
    >
      <div class="flex items-center">
        <component
          class="mr-1 h-5 w-5 text-gray-400"
          v-if="props.icon"
          :is="props.icon"
        />
        <span class="ml-1 truncate">{{ props.text }}</span>
      </div>
    </div>
    <div class="space-y-2 rounded-b-lg border-2 border-t-0 border-gray-100 p-2">
      <slot />
    </div>
  </div>
</template>
