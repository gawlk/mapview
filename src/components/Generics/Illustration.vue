<script setup lang="ts">
  import type { GenericIllustrationProps } from './interfaces'
  import { defaultRounded } from './defaults'

  const props = defineProps<GenericIllustrationProps>()

  const classes = [
    props.xxl
      ? 'h-8 w-8'
      : props.xl
      ? 'h-7 w-7'
      : props.lg
      ? 'h-[1.625rem] w-[1.625rem]'
      : props.sm
      ? 'h-5 w-5'
      : 'h-6 w-6',
    props.horizontal
      ? props.right || props.rightSvg || props.rightSrc
        ? props.xxl
          ? 'ml-3 -mr-2.5'
          : props.xl
          ? 'ml-2.5 -mr-2'
          : props.lg
          ? 'ml-2 -mr-1.5'
          : props.sm
          ? 'ml-1 -mr-0.5'
          : 'ml-1.5 -mr-1'
        : props.xxl
        ? '-ml-2.5 mr-4'
        : props.xl
        ? '-ml-2 mr-3'
        : props.lg
        ? '-ml-1.5 mr-2.5'
        : props.sm
        ? '-ml-0.5 mr-1'
        : '-ml-1 mr-1.5'
      : '',

    props.colorless
      ? ''
      : props.primary
      ? 'text-red-400'
      : props.black
      ? 'text-stone-500'
      : props.red
      ? 'text-red-400'
      : props.orange
      ? 'text-orange-400'
      : props.amber
      ? 'text-amber-400'
      : props.yellow
      ? 'text-yellow-400'
      : props.lime
      ? 'text-lime-400'
      : props.green
      ? 'text-green-400'
      : props.emerald
      ? 'text-emerald-400'
      : props.teal
      ? 'text-teal-400'
      : props.cyan
      ? 'text-cyan-400'
      : props.sky
      ? 'text-sky-400'
      : props.blue
      ? 'text-blue-400'
      : props.indigo
      ? 'text-indigo-400'
      : props.violet
      ? 'text-violet-400'
      : props.purple
      ? 'text-purple-400'
      : props.fuchsia
      ? 'text-fuchsia-400'
      : props.pink
      ? 'text-pink-400'
      : props.rose
      ? 'text-rose-400'
      : 'text-stone-400',
    !props.disabled && (props.clickable || props.focusable)
      ? props.colorless
        ? ''
        : props.primary
        ? 'group-hover:text-red-500'
        : props.black
        ? 'group-hover:text-stone-400'
        : props.red
        ? 'group-hover:text-red-500'
        : props.orange
        ? 'group-hover:text-orange-500'
        : props.amber
        ? 'group-hover:text-amber-500'
        : props.yellow
        ? 'group-hover:text-yellow-500'
        : props.lime
        ? 'group-hover:text-lime-500'
        : props.green
        ? 'group-hover:text-green-500'
        : props.emerald
        ? 'group-hover:text-emerald-500'
        : props.teal
        ? 'group-hover:text-teal-500'
        : props.cyan
        ? 'group-hover:text-cyan-500'
        : props.sky
        ? 'group-hover:text-sky-500'
        : props.blue
        ? 'group-hover:text-blue-500'
        : props.indigo
        ? 'group-hover:text-indigo-500'
        : props.violet
        ? 'group-hover:text-violet-500'
        : props.purple
        ? 'group-hover:text-purple-500'
        : props.fuchsia
        ? 'group-hover:text-fuchsia-500'
        : props.pink
        ? 'group-hover:text-pink-500'
        : props.rose
        ? 'group-hover:text-rose-500'
        : 'group-hover:text-stone-500'
      : '',

    props.src || props.leftSrc || props.rightSrc
      ? ['object-contain', props.rounded || defaultRounded ? 'rounded-md' : '']
      : '',

    props.illustrationClasses ||
      props.leftIllustrationClasses ||
      props.rightIllustrationClasses ||
      '',

    'flex-none transition transform duration-200 motion-reduce:transition-none motion-reduce:transform-none',
  ]
</script>

<template>
  <component
    :is="props.svg || props.leftSvg || props.rightSvg || 'img'"
    :src="props.src || props.leftSrc || props.rightSrc"
    :class="classes"
  />
</template>
