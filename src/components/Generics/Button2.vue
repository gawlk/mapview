<script setup lang="ts">
  import { defaultRounded } from './defaults'

  const props = defineProps<{
    // Element
    element?: any

    // Sizes
    xxl?: boolean
    xl?: boolean
    lg?: boolean
    sm?: boolean

    // Full
    full?: boolean

    // Round
    rounded?: boolean
    roundedFull?: boolean

    // Border
    border?: boolean

    // Colors
    brand?: boolean
    brand2?: boolean
    primary?: boolean
    secondary?: boolean
    tertiary?: boolean

    // States
    disabled?: boolean
    inactive?: boolean

    // Illustrations
    svg?: any
    leftSvg?: any
    rightSvg?: any
    src?: string
    leftSrc?: string
    rightSrc?: string

    // Classes
    buttonClasses?: string
    illustrationClasses?: string
    leftIllustrationClasses?: string
    rightIllustrationClasses?: string
  }>()
</script>

<template>
  <component
    :is="props.element || 'button'"
    :disabled="props.disabled"
    :class="[
      // Sizes
      props.lg ? 'text-lg' : props.sm ? 'text-sm' : 'text-base',

      // Padding
      props.secondary // If has border
        ? props.lg
          ? 'px-[1.875rem] py-3'
          : props.sm
          ? 'px-3.5 py-2'
          : 'px-[1.375rem] py-2.5'
        : props.lg
        ? 'px-8 py-3.5'
        : props.sm
        ? 'px-4 py-2.5'
        : 'px-6 py-3',

      // Rounded
      props.roundedFull
        ? 'rounded-full'
        : props.rounded || defaultRounded
        ? 'rounded-lg'
        : '',

      props.brand
        ? 'bg-orange-600 text-white '
        : props.brand2
        ? 'bg-indigo-600 text-white '
        : props.primary
        ? 'bg-black text-white dark:bg-white dark:text-black'
        : props.secondary
        ? 'border-2 border-black bg-white dark:border-white dark:bg-black dark:text-white'
        : 'text-black dark:text-white',

      props.disabled
        ? 'disabled:transform-none disabled:cursor-default  disabled:transition-none'
        : props.brand
        ? 'hover:bg-orange-500'
        : props.brand2
        ? 'hover:bg-indigo-500'
        : props.primary
        ? 'hover:bg-gray-800 dark:hover:bg-gray-200'
        : props.secondary
        ? 'hover:bg-gray-200 dark:hover:bg-gray-800'
        : 'hover:bg-gray-200 dark:hover:bg-gray-800',
      props.disabled || props.inactive ? 'opacity-60' : '',

      'group transform font-semibold transition duration-200 active:scale-95 motion-reduce:transform-none motion-reduce:transition-none ',
    ]"
  >
    <Illustration
      v-if="props.svg || props.leftSvg || props.src || props.leftSrc"
      v-bind="props"
    />
    <slot></slot>
    <Illustration v-if="props.rightSvg || props.rightSrc" v-bind="props" />
  </component>
</template>
