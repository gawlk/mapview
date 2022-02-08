<template>
  <HeadlessDisclosure
    v-slot="{ open }"
    as="div"
    :defaultOpen="props.defaultOpen"
  >
    <DisclosureButton
      :class="emitToggle(open) ? 'rounded-t-lg' : 'rounded-lg'"
      class="group flex w-full items-center justify-between bg-gray-100 py-2 px-4 text-sm font-medium leading-6 transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
    >
      <div class="flex items-center">
        <component
          v-if="props.icon"
          :is="props.icon"
          class="mr-1 h-5 w-5 text-gray-400 transition-colors duration-200 group-hover:text-gray-500"
        />
        <span class="ml-1 truncate">{{ props.text }}</span>
      </div>
      <IconHeroiconsSolidChevronUp
        :class="open ? 'rotate-180 transform' : ''"
        class="h-5 w-5 text-gray-400 transition-colors duration-200 group-hover:text-gray-500"
      />
    </DisclosureButton>
    <DisclosurePanel
      class="space-y-2 rounded-b-lg border-2 border-t-0 border-gray-100 p-2"
    >
      <slot />
    </DisclosurePanel>
  </HeadlessDisclosure>
</template>

<script setup lang="ts">
  import {
    Disclosure as HeadlessDisclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@headlessui/vue'

  const emit = defineEmits<{
    (event: 'click', value: boolean): void
  }>()

  const props = defineProps<{
    text: string
    defaultOpen: boolean
    icon?: any
  }>()

  const emitToggle = (open: boolean) => {
    emit('click', open)
    return open
  }
</script>
