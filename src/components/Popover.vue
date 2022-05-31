<script setup lang="ts">
  import {
    Popover as HeadlessPopover,
    PopoverButton,
    PopoverPanel,
  } from '@headlessui/vue'

  import TransitionDropdown from './TransitionDropdown.vue'

  const props = defineProps<{
    buttonText: string
    full: boolean
    icon: any
    preText?: string
  }>()
</script>

<template>
  <HeadlessPopover
    as="div"
    :class="[props.full ? 'w-full' : '']"
    class="relative inline-block text-left"
  >
    <PopoverButton
      class="group flex w-full items-center justify-between space-x-1 truncate rounded-lg bg-gray-100 py-2 px-4 text-sm font-medium leading-6 transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300"
    >
      <component
        v-if="props.icon"
        :is="props.icon"
        class="mr-1 h-5 w-5 text-gray-400 transition-colors duration-200 group-hover:text-gray-500"
      />
      <span v-if="props.preText" class="ml-1 text-gray-500">
        {{ props.preText }}
      </span>
      <span class="flex-1 truncate text-left">
        {{ props.buttonText }}
      </span>
      <IconHeroiconsSolidChevronDown
        class="h-5 w-5 text-gray-400 transition-colors duration-200 group-hover:text-gray-500"
      />
    </PopoverButton>

    <TransitionDropdown>
      <PopoverPanel
        class="absolute bottom-0 z-10 mb-11 max-h-60 w-full space-y-1 overflow-auto rounded-lg border-2 border-gray-100 bg-white p-1 text-sm shadow-md focus:outline-none lg:bottom-auto lg:mt-1 lg:shadow-lg"
      >
        <slot />
      </PopoverPanel>
    </TransitionDropdown>
  </HeadlessPopover>
</template>
