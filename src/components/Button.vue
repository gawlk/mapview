<template>
  <button
    :disabled="props.disabled"
    :class="[
      props.xxl
        ? 'rounded-2xl py-6 px-12 text-2xl font-medium'
        : props.xl
        ? 'rounded-xl py-4 px-8 text-xl font-medium'
        : props.lg
        ? 'rounded-xl p-2.5 px-5 text-base font-medium sm:py-3 sm:px-6 sm:text-lg'
        : props.sm
        ? 'rounded-lg py-1 px-2 text-xs font-medium'
        : 'rounded-lg py-2 px-4 text-sm font-medium',
      props.dark
        ? 'bg-gray-800 text-white focus:ring-gray-600'
        : props.blue
        ? 'bg-blue-200 text-blue-900 focus:ring-blue-100'
        : props.green
        ? 'bg-green-200 text-green-900 focus:ring-green-100'
        : props.red
        ? 'bg-red-200 text-red-900 focus:ring-red-100'
        : props.orange
        ? 'bg-orange-200 text-orange-900 focus:ring-orange-100'
        : props.transparent
        ? 'text-gray-900'
        : 'bg-gray-100 text-gray-900 focus:ring-gray-50',
      !props.disabled
        ? props.dark
          ? 'hover:bg-gray-700'
          : props.blue
          ? 'hover:bg-blue-300'
          : props.green
          ? 'hover:bg-green-300'
          : props.red
          ? 'hover:bg-red-300'
          : props.orange
          ? 'hover:bg-orange-300'
          : 'hover:bg-gray-200'
        : '',
      props.full && 'w-full',
      props.truncate && 'truncate',
      props.disabled ? 'cursor-default opacity-75' : 'cursor-pointer',
    ]"
    class="group inline-flex items-center space-x-2 leading-6 transition-colors duration-200 focus:outline-none focus:ring"
  >
    <component
      v-if="props.icon || props.leftIcon || props.rightIcon"
      :is="props.icon || props.leftIcon || 'span'"
      :class="[iconsColors, iconsClasses]"
      class="h-5 w-5 transition-colors duration-200"
    />
    <span
      v-if="!props.icon"
      :class="[
        props.centered ? 'text-center' : 'text-left',
        props.truncate && 'truncate',
      ]"
      class="flex-1"
    >
      <slot />
    </span>
    <component
      v-if="props.rightIcon"
      :is="props.rightIcon || 'span'"
      :class="[iconsColors, iconsClasses]"
      class="h-5 w-5 transition-colors duration-200"
    />
  </button>
</template>

<script setup lang="ts">
  const props = defineProps<{
    disabled?: boolean
    dark?: boolean
    green?: boolean
    orange?: boolean
    red?: boolean
    blue?: boolean
    transparent?: boolean
    sm?: boolean
    lg?: boolean
    xl?: boolean
    xxl?: boolean
    full?: boolean
    centered?: boolean
    truncate?: boolean
    icon?: any
    leftIcon?: any
    rightIcon?: any
    iconsClasses?: string
  }>()

  const iconsColors = props.dark
    ? `text-gray-500 ${props.disabled ? '' : 'group-hover:text-gray-400'}`
    : props.blue
    ? `text-blue-500 ${props.disabled ? '' : 'group-hover:text-blue-600'}`
    : props.green
    ? `text-green-500 ${props.disabled ? '' : 'group-hover:text-green-600'}`
    : props.red
    ? `text-red-500 ${props.disabled ? '' : 'group-hover:text-red-600'}`
    : props.orange
    ? `text-orange-500 ${props.disabled ? '' : 'group-hover:text-orange-600'}`
    : `text-gray-400 ${props.disabled ? '' : 'group-hover:text-gray-500'}`
</script>
