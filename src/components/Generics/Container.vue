<script setup lang="ts">
  import type { GenericContainerProps } from './interfaces'
  import { defaultRounded } from './defaults'

  const props = defineProps<GenericContainerProps>()

  const classes = computed(() => [
    // Sizes
    props.xxxl
      ? 'text-2xl sm:text-3xl font-black p-7'
      : props.xxl
      ? 'text-xl sm:text-2xl font-black p-6'
      : props.xl
      ? 'text-lg sm:text-xl font-bold p-5'
      : props.lg
      ? 'text-base sm:text-lg font-semibold p-4'
      : props.sm
      ? 'text-sm font-medium p-3'
      : 'text-base font-medium p-3.5',

    // Direction
    props.horizontal
      ? props.xxxl
        ? 'px-8'
        : props.xxl
        ? 'px-7'
        : props.xl
        ? 'px-6'
        : props.lg
        ? 'px-5'
        : props.sm
        ? 'px-3'
        : 'px-4'
      : props.vertical
      ? props.xxxl
        ? 'py-8'
        : props.xxl
        ? 'py-7'
        : props.xl
        ? 'py-6'
        : props.lg
        ? 'py-5'
        : props.sm
        ? 'py-3'
        : 'py-4'
      : '',

    // Full
    props.full ? 'flex w-full' : 'flex-inline',

    // Directions
    props.vertical ? 'h-full flex-col' : '',

    // Rounded
    props.rounded || defaultRounded
      ? props.xxxl
        ? 'rounded-[2rem]'
        : props.xxl
        ? 'rounded-3xl'
        : props.xl
        ? 'rounded-2xl'
        : props.lg
        ? 'rounded-xl'
        : props.sm
        ? 'rounded'
        : 'rounded-lg'
      : '',

    // Colors
    props.colorless
      ? ''
      : props.transparent
      ? 'text-stone-900'
      : props.primary
      ? 'text-primary-50'
      : props.secondary
      ? 'text-secondary-50'
      : props.tertiary
      ? 'text-tertiary-50'
      : props.black
      ? 'text-white'
      : props.red
      ? 'text-red-900'
      : props.orange
      ? 'text-orange-900'
      : props.amber
      ? 'text-amber-900'
      : props.yellow
      ? 'text-yellow-900'
      : props.lime
      ? 'text-lime-900'
      : props.green
      ? 'text-green-900'
      : props.emerald
      ? 'text-emerald-900'
      : props.teal
      ? 'text-teal-900'
      : props.cyan
      ? 'text-cyan-900'
      : props.sky
      ? 'text-sky-900'
      : props.blue
      ? 'text-blue-900'
      : props.indigo
      ? 'text-indigo-900'
      : props.violet
      ? 'text-violet-900'
      : props.purple
      ? 'text-purple-900'
      : props.fuchsia
      ? 'text-fuchsia-900'
      : props.pink
      ? 'text-pink-900'
      : props.rose
      ? 'text-rose-900'
      : 'text-stone-900',
    props.colorless || props.transparent
      ? ''
      : props.clickable
      ? props.primary
        ? 'bg-primary-600'
        : props.secondary
        ? 'bg-secondary-600'
        : props.tertiary
        ? 'bg-tertiary-600'
        : props.black
        ? 'bg-black text-white'
        : props.red
        ? 'bg-red-800 text-red-50'
        : props.orange
        ? 'bg-orange-800 text-orange-50'
        : props.amber
        ? 'bg-amber-800 text-amber-50'
        : props.yellow
        ? 'bg-yellow-800 text-yellow-50'
        : props.lime
        ? 'bg-lime-800 text-lime-50'
        : props.green
        ? 'bg-green-800 text-green-50'
        : props.emerald
        ? 'bg-emerald-800 text-emerald-50'
        : props.teal
        ? 'bg-teal-800 text-teal-50'
        : props.cyan
        ? 'bg-cyan-800 text-cyan-50'
        : props.sky
        ? 'bg-sky-800 text-sky-50'
        : props.blue
        ? 'bg-blue-800 text-blue-50'
        : props.indigo
        ? 'bg-indigo-800 text-indigo-50'
        : props.violet
        ? 'bg-violet-800 text-violet-50'
        : props.purple
        ? 'bg-purple-800 text-purple-50'
        : props.fuchsia
        ? 'bg-fuchsia-800 text-fuchsia-50'
        : props.pink
        ? 'bg-pink-800 text-pink-50'
        : props.rose
        ? 'bg-rose-800 text-rose-50'
        : 'bg-stone-800 text-stone-50'
      : props.primary
      ? 'bg-primary-500'
      : props.secondary
      ? 'bg-secondary-500'
      : props.tertiary
      ? 'bg-tertiary-500'
      : props.black
      ? 'bg-stone-900'
      : props.red
      ? 'bg-red-200'
      : props.orange
      ? 'bg-orange-200'
      : props.amber
      ? 'bg-amber-200'
      : props.yellow
      ? 'bg-yellow-200'
      : props.lime
      ? 'bg-lime-200'
      : props.green
      ? 'bg-green-200'
      : props.emerald
      ? 'bg-emerald-200'
      : props.teal
      ? 'bg-teal-200'
      : props.cyan
      ? 'bg-cyan-200'
      : props.sky
      ? 'bg-sky-200'
      : props.blue
      ? 'bg-blue-200'
      : props.indigo
      ? 'bg-indigo-200'
      : props.violet
      ? 'bg-violet-200'
      : props.purple
      ? 'bg-purple-200'
      : props.fuchsia
      ? 'bg-fuchsia-200'
      : props.pink
      ? 'bg-pink-200'
      : props.rose
      ? 'bg-rose-200'
      : 'bg-stone-200',

    // States
    props.clickable ? 'appearance-none select-none focus:outline-none' : '',
    props.clickable || props.focusable
      ? 'group transition transform duration-200  motion-reduce:transition-none motion-reduce:transform-none active:scale-95'
      : '',
    props.disabled
      ? 'opacity-75 cursor-default'
      : [
          props.clickable
            ? [
                'cursor-pointer focus:ring-offset-white focus:ring-black',
                props.xxl
                  ? 'focus:ring-8 focus:ring-offset-8'
                  : props.xl
                  ? 'focus:ring-[6px] focus:ring-offset-[6px]'
                  : props.lg
                  ? 'focus:ring-4 focus:ring-offset-4'
                  : 'focus:ring focus:ring-offset-[3px]',
                props.colorless
                  ? ''
                  : props.primary
                  ? 'hover:bg-primary-700'
                  : props.secondary
                  ? 'hover:bg-secondary-700'
                  : props.tertiary
                  ? 'hover:bg-tertiary-700'
                  : props.black
                  ? 'hover:bg-stone-800'
                  : props.red
                  ? 'hover:bg-red-900'
                  : props.orange
                  ? 'hover:bg-orange-900'
                  : props.amber
                  ? 'hover:bg-amber-900'
                  : props.yellow
                  ? 'hover:bg-yellow-900'
                  : props.lime
                  ? 'hover:bg-lime-900'
                  : props.green
                  ? 'hover:bg-green-900'
                  : props.emerald
                  ? 'hover:bg-emerald-900'
                  : props.teal
                  ? 'hover:bg-teal-900'
                  : props.cyan
                  ? 'hover:bg-cyan-900'
                  : props.sky
                  ? 'hover:bg-sky-900'
                  : props.blue
                  ? 'hover:bg-blue-900'
                  : props.indigo
                  ? 'hover:bg-indigo-900'
                  : props.violet
                  ? 'hover:bg-violet-900'
                  : props.purple
                  ? 'hover:bg-purple-900'
                  : props.fuchsia
                  ? 'hover:bg-fuchsia-900'
                  : props.pink
                  ? 'hover:bg-pink-900'
                  : props.rose
                  ? 'hover:bg-rose-900'
                  : 'hover:bg-stone-200',
              ]
            : '',
          props.focusable
            ? props.colorless
              ? ''
              : props.primary
              ? 'hover:border-red-700'
              : props.black
              ? 'hover:border-stone-800'
              : props.red
              ? 'hover:border-red-200'
              : props.orange
              ? 'hover:border-orange-200'
              : props.amber
              ? 'hover:border-amber-200'
              : props.yellow
              ? 'hover:border-yellow-200'
              : props.lime
              ? 'hover:border-lime-200'
              : props.green
              ? 'hover:border-green-200'
              : props.emerald
              ? 'hover:border-emerald-200'
              : props.teal
              ? 'hover:border-teal-200'
              : props.cyan
              ? 'hover:border-cyan-200'
              : props.sky
              ? 'hover:border-sky-200'
              : props.blue
              ? 'hover:border-blue-200'
              : props.indigo
              ? 'hover:border-indigo-200'
              : props.violet
              ? 'hover:border-violet-200'
              : props.purple
              ? 'hover:border-purple-200'
              : props.fuchsia
              ? 'hover:border-fuchsia-200'
              : props.pink
              ? 'hover:border-pink-200'
              : props.rose
              ? 'hover:border-rose-200'
              : 'hover:border-stone-200'
            : '',
          props.clickable || props.focusable
            ? [
                'focus-within:ring-offset-white',
                props.xxl
                  ? 'focus-within:ring-8 focus-within:ring-offset-8'
                  : props.xl
                  ? 'focus-within:ring-[6px] focus-within:ring-offset-[6px]'
                  : props.lg
                  ? 'focus-within:ring-4 focus-within:ring-offset-4'
                  : 'focus-within:ring focus-within:ring-offset-[3px]',
                props.colorless
                  ? ''
                  : props.primary
                  ? 'focus-within:ring-red-700'
                  : props.black
                  ? 'focus-within:ring-stone-800'
                  : props.red
                  ? 'focus-within:ring-red-200'
                  : props.orange
                  ? 'focus-within:ring-orange-200'
                  : props.amber
                  ? 'focus-within:ring-amber-200'
                  : props.yellow
                  ? 'focus-within:ring-yellow-200'
                  : props.lime
                  ? 'focus-within:ring-lime-200'
                  : props.green
                  ? 'focus-within:ring-green-200'
                  : props.emerald
                  ? 'focus-within:ring-emerald-200'
                  : props.teal
                  ? 'focus-within:ring-teal-200'
                  : props.cyan
                  ? 'focus-within:ring-cyan-200'
                  : props.sky
                  ? 'focus-within:ring-sky-200'
                  : props.blue
                  ? 'focus-within:ring-blue-200'
                  : props.indigo
                  ? 'focus-within:ring-indigo-200'
                  : props.violet
                  ? 'focus-within:ring-violet-200'
                  : props.purple
                  ? 'focus-within:ring-purple-200'
                  : props.fuchsia
                  ? 'focus-within:ring-fuchsia-200'
                  : props.pink
                  ? 'focus-within:ring-pink-200'
                  : props.rose
                  ? 'focus-within:ring-rose-200'
                  : 'focus-within:ring-orange-200',
              ]
            : '',

          props.containerClasses || '',
        ],
  ])
</script>

<template>
  <component :is="props.element || 'div'" :class="classes">
    <slot></slot>
  </component>
</template>
