<script setup lang="ts">
  import store from '/src/store'

  import {
    DisclosureButton,
    DisclosurePanel,
    Disclosure as HeadlessDisclosure,
  } from '@headlessui/vue'

  const emit = defineEmits<{
    (event: 'click', value: boolean): void
  }>()

  const props = defineProps<{
    readonly text: string
    readonly defaultOpen: boolean
    readonly icon?: any
  }>()

  const emitToggle = (open: boolean) => {
    emit('click', open)
    return open
  }
</script>

<template>
  <HeadlessDisclosure
    v-slot="{ open }"
    as="div"
    :defaultOpen="props.defaultOpen"
  >
    <DisclosureButton
      class="group flex w-full items-center justify-between bg-gray-100 py-2 px-4 text-sm font-medium leading-6 transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
      :class="emitToggle(open) ? 'rounded-t-lg' : 'rounded-lg'"
    >
      <div class="flex items-center">
        <component
          class="mr-1 h-5 w-5 text-gray-400 transition-colors duration-200 group-hover:text-gray-500"
          v-if="props.icon"
          :is="props.icon"
        />
        <span class="ml-1 truncate">{{ props.text }}</span>
      </div>
      <IconHeroiconsSolidChevronRight
        class="h-5 w-5 text-gray-400 transition-colors duration-200 group-hover:text-gray-500"
        :class="open ? 'rotate-90 transform' : ''"
      />
    </DisclosureButton>
    <DisclosurePanel
      class="space-y-2 rounded-b-lg border-2 border-t-0 border-gray-100 p-2"
    >
      <slot />
    </DisclosurePanel>
  </HeadlessDisclosure>
</template>
