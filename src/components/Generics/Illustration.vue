<script setup lang="ts">
  import { defaultRounded } from './defaults'

  const props = defineProps<{
    // Sizes
    lg?: boolean
    sm?: boolean

    // Colors
    brand?: boolean
    brand2?: boolean
    primary?: boolean
    secondary?: boolean
    tertiary?: boolean

    // Illustrations
    svg?: any
    src?: string

    // Sides
    left?: boolean
    right?: boolean

    // Classes
    classes?: string
  }>()
</script>

<template>
  <component
    :is="props.src ? 'img' : props.svg || 'span'"
    :src="props.src"
    :class="[
      // Sizes
      props.lg ? 'h-[1.625rem] w-[1.625rem]' : props.sm ? 'h-5 w-5' : 'h-6 w-6',

      // Padding
      props.left
        ? props.lg
          ? '-ml-1.5 mr-2.5'
          : props.sm
          ? '-ml-0.5 mr-1'
          : '-ml-1 mr-1.5'
        : props.right
        ? props.lg
          ? 'ml-2 -mr-1.5'
          : props.sm
          ? 'ml-1 -mr-0.5'
          : 'ml-1.5 -mr-1'
        : '',

      // Colors
      props.brand
        ? 'text-orange-400 group-hover:text-orange-300'
        : props.brand2
        ? 'text-indigo-400 group-hover:text-indigo-300'
        : props.primary
        ? 'text-stone-600 group-hover:text-stone-500 dark:text-stone-400'
        : props.secondary
        ? 'text-stone-400 group-hover:text-stone-500 dark:text-stone-600'
        : 'text-stone-400 group-hover:text-stone-500 dark:text-stone-600',

      props.src ? ['object-contain', defaultRounded ? 'rounded-md' : ''] : '',

      props.classes || '',

      'flex-none transform transition duration-200 motion-reduce:transform-none motion-reduce:transition-none',
    ]"
  />
</template>
