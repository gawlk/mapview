<script setup lang="ts">
  import IconColorSwatch from '~icons/heroicons-solid/color-swatch'

  const { t } = useI18n()
</script>

<template>
  <Disclosure
    :icon="IconColorSwatch"
    :text="t('Color')"
    @click="() => {}"
    :defaultOpen="false"
  >
  </Disclosure>
</template>
