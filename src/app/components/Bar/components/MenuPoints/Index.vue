<script setup lang="ts">
  import ListboxColorization from './components/ListboxColorization.vue'
  import Values from './components/Values.vue'
  import Thresholds from './components/Thresholds.vue'

  import Submenu from '/src/components/Submenu.vue'

  import IconFold from '~icons/octicon/fold-16'
  import IconNumber from '~icons/octicon/number-16'

  const { t } = useI18n()

  const props = defineProps<{
    menu: MenuProps
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
