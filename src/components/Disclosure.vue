<template>
  <Disclosure v-slot="{ open }" as="div" :defaultOpen="props.defaultOpen">
    <DisclosureButton
      :class="emitToggle(open) ? 'rounded-t-lg' : 'rounded-lg'"
      class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-6 transition-colors duration-200 bg-gray-100  group hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
    >
      <div class="flex items-center">
        <component
          v-if="props.icon"
          :is="props.icon"
          class="w-5 h-5 mr-1 text-gray-400 transition-colors duration-200  group-hover:text-gray-500"
        />
        <span class="ml-1 truncate">{{ props.text }}</span>
      </div>
      <ChevronUpIcon
        :class="open ? 'transform rotate-180' : ''"
        class="w-5 h-5 text-gray-400 transition-colors duration-200  group-hover:text-gray-500"
      />
    </DisclosureButton>
    <DisclosurePanel
      class="p-2 space-y-2 border-2 border-t-0 border-gray-100 rounded-b-lg"
    >
      <slot />
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue'

  import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@headlessui/vue'
  import { ChevronUpIcon } from '@heroicons/vue/solid'

  const emit = defineEmits(['click'])

  const props = defineProps<{
    text: string
    icon?: () => any
    defaultOpen: boolean
  }>()

  const emitToggle = (open: boolean) => {
    emit('click', open)
    return open
  }
</script>
