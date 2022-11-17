<script setup lang="ts">
  import IconFold from '~icons/octicon/fold-16'
  import IconNumber from '~icons/octicon/number-16'

  import Submenu from '/src/components/Submenu.vue'

  import ListboxColorization from './components/ListboxColorization.vue'
  import Thresholds from './components/Thresholds.vue'
  import Values from './components/Values.vue'

  const { t } = useI18n()

  const props = defineProps<{
    readonly menu: MenuProps
  }>()
</script>

<template>
  <ListboxColorization />
  <Submenu
    :buttonIcon="IconNumber"
    :buttonText="`${t('Value settings')}`"
    :menuProps="props.menu"
    :route="` / ${t('Value')}`"
  >
    <Values />
  </Submenu>
  <Submenu
    :buttonIcon="IconFold"
    :buttonText="`${t('Thresholds settings')}`"
    :menuProps="props.menu"
    :route="` / ${t('Thresholds')}`"
  >
    <Thresholds />
  </Submenu>
</template>

<i18n lang="yaml">
fr:
  'Value settings': 'Configuration de la valeur'
  'Thresholds settings': 'Configuration des seuils'
</i18n>
