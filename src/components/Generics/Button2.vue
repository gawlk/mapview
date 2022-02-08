<script setup lang="ts">
  import { mergeProps } from 'vue'
  import type { GenericContainerProps } from './interfaces'

  const props = defineProps<GenericContainerProps>()

  const mergedProps = mergeProps(props, {
    element: 'button',
    clickable: true,
    horizontal: true,
  } as GenericContainerProps as any)

  watch(
    () => mergedProps,
    () => console.log('button props', { ...mergedProps }),
    { immediate: true }
  )
</script>

<template>
  <Container v-bind="mergedProps">
    <Illustration
      v-if="
        mergedProps.svg ||
        mergedProps.leftSvg ||
        mergedProps.src ||
        mergedProps.leftSrc
      "
      v-bind="mergedProps"
    >
      <slot name="left" />
    </Illustration>
    <slot />
    <Illustration
      v-if="mergedProps.rightSvg || mergedProps.rightSrc"
      v-bind="mergedProps"
    >
      <slot name="right" />
    </Illustration>
  </Container>
</template>
