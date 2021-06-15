<template>
  <Disclosure v-slot="{ open }" as="div">
    <DisclosureButton
      :class="open ? 'rounded-t-lg' : 'rounded-lg'"
      class="
        flex
        justify-between
        items-center
        w-full
        px-4
        py-2
        text-sm
        font-medium
        leading-6
        bg-gray-100
        group
        transition-colors
        duration-200
        hover:bg-gray-200
        focus:outline-none
        focus-visible:ring
        focus-visible:ring-gray-500
        focus-visible:ring-opacity-75
      "
    >
      <div class="flex items-center">
        <component
          v-if="props.icon"
          :is="props.icon"
          class="
            h-5
            w-5
            text-gray-400
            group-hover:text-gray-500
            mr-1
            transition-colors
            duration-200
          "
        />
        <span class="ml-1 truncate">{{ props.text }}</span>
      </div>
      <ChevronUpIcon
        :class="open ? 'transform rotate-180' : ''"
        class="
          w-5
          h-5
          text-gray-400
          group-hover:text-gray-500
          transition-colors
          duration-200
        "
      />
    </DisclosureButton>
    <DisclosurePanel
      class="p-2 border-2 border-t-0 border-gray-100 rounded-b-lg space-y-2"
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

  const props = defineProps({
    icon: Function,
    text: String,
  })
</script>
