<script setup lang="ts">
  import { defaultRounded } from './defaults'

  const props = defineProps<{
    // Element
    readonly element?: any

    // Full
    readonly full?: boolean

    // Sizes
    readonly lg?: boolean
    readonly sm?: boolean

    // Round
    readonly rounded?: boolean
    readonly roundedFull?: boolean

    // Border
    readonly border?: boolean

    // Center
    readonly center?: boolean

    // Colors
    readonly brand?: boolean
    readonly brand2?: boolean
    readonly primary?: boolean
    readonly secondary?: boolean
    readonly tertiary?: boolean

    // States
    readonly disabled?: boolean
    readonly inactive?: boolean

    // Illustrations
    readonly svg?: any
    readonly leftSvg?: any
    readonly rightSvg?: any
    readonly src?: string
    readonly leftSrc?: string
    readonly rightSrc?: string

    // Classes
    readonly classes?: string
    readonly illustrationClasses?: string
    readonly leftIllustrationClasses?: string
    readonly rightIllustrationClasses?: string
  }>()
</script>

<template>
  <component
    :is="props.element || 'button'"
    :disabled="props.disabled"
    :class="[
      // Full
      props.full ? 'w-full' : '',

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

      // Center
      props.center ? 'justify-center' : '',

      // Colors
      props.brand
        ? 'text-white '
        : props.brand2
        ? 'text-white '
        : props.primary
        ? 'text-white dark:text-black'
        : props.secondary
        ? 'border-2 border-black dark:border-white dark:text-white'
        : 'text-black dark:text-white',

      // Background colors
      props.inactive
        ? 'bg-transparent'
        : props.brand
        ? 'bg-orange-600'
        : props.brand2
        ? 'bg-indigo-600'
        : props.primary
        ? 'bg-black dark:bg-white '
        : props.secondary
        ? 'bg-stone-100 dark:bg-stone-900 '
        : 'bg-stone-100 dark:bg-stone-900 ',

      // Hover colors
      !props.disabled
        ? props.brand
          ? 'hover:bg-orange-500'
          : props.brand2
          ? 'hover:bg-indigo-500'
          : props.primary
          ? 'hover:bg-stone-800 dark:hover:bg-stone-200'
          : props.secondary
          ? 'hover:bg-stone-200 dark:hover:bg-stone-800'
          : 'hover:bg-stone-200 dark:hover:bg-stone-800'
        : '',

      // Disabled
      disabled
        ? 'disabled:transform-none disabled:cursor-default  disabled:transition-none'
        : 'group',

      // Opacity
      props.disabled || props.inactive ? 'opacity-60' : '',

      props.classes || '',

      'inline-flex transform items-center font-semibold transition duration-200 focus:outline-none focus-visible:outline-offset-2 focus-visible:outline-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none dark:focus-visible:outline-white',
    ]"
  >
    <Illustration
      v-if="props.svg || props.leftSvg || props.src || props.leftSrc"
      v-bind="props"
      :svg="props.svg || props.leftSvg"
      :src="props.src || props.leftSrc"
      :left="!!(props.leftSvg || props.leftSrc)"
      :classes="props.illustrationClasses || props.leftIllustrationClasses"
    />
    <span :class="[props.center ? 'text-center' : 'text-left', 'flex-1']"
      ><slot></slot
    ></span>
    <Illustration
      v-if="
        props.rightSvg ||
        props.rightSrc ||
        (props.center && (props.leftSvg || props.leftSrc))
      "
      v-bind="props"
      :svg="props.rightSvg"
      :src="props.rightSrc"
      :right="true"
      :classes="props.rightIllustrationClasses"
    />
  </component>
</template>
