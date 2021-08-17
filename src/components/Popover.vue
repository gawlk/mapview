<template>
  <Popover
    as="div"
    :class="[props.full && 'w-full']"
    class="relative inline-block text-left"
  >
    <PopoverButton
      class="flex items-center justify-between w-full px-4 py-2 space-x-1 text-sm font-medium leading-6 transition-colors duration-200 bg-gray-100 rounded-lg  hover:bg-gray-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500"
    >
      <component
        v-if="props.icon"
        :is="props.icon"
        class="w-5 h-5 mr-1 text-gray-400 transition-colors duration-200  group-hover:text-gray-500"
      />
      <span class="flex-1 text-left">{{ props.buttonText }}</span>
      <ChevronDownIcon
        class="w-5 h-5 text-gray-400 transition-colors duration-200  group-hover:text-gray-500"
      />
    </PopoverButton>

    <TransitionDropdown>
      <PopoverPanel
        :class="[props.isTop ? 'bottom-0 mb-11' : 'mt-1 shadow-lg']"
        class="absolute z-10 w-full p-1 space-y-1 overflow-auto text-base bg-white border-2 border-gray-100 rounded-lg  max-h-60 focus:outline-none sm:text-sm"
      >
        <slot />
      </PopoverPanel>
    </TransitionDropdown>
  </Popover>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue'

  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
  import { ChevronDownIcon } from '@heroicons/vue/solid'

  import { Button, TransitionDropdown } from '.'

  const props = defineProps<{
    buttonText: string
    full: boolean
    icon: () => void
    isTop?: boolean
  }>()
</script>
