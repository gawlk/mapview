<script setup lang="ts">
  import store from '/src/store'
  import { icons } from '/src/scripts'

  import IconColorStar from '~icons/heroicons-solid/star'

  const { t } = useI18n()

  const pointIconValues = Object.keys(icons).map((key) => {
    return `<div class="flex space-x-1.5">
        <div class="ml-1">
          ${icons[key as IconName]}
        </div>
        <span>${t(key)}</span>
      </div>`
  })

  const setIcon = (index: number) => {
    if (store.projects.selected?.reports.selected) {
      store.projects.selected.reports.selected.settings.iconName = Object.keys(
        icons
      )[index] as IconName
    }
  }
</script>

<template>
  <Listbox
    full
    @selectIndex="setIcon"
    :icon="IconColorStar"
    :preSelected="`${t('Icon')}${t(':')}`"
    :selected="
      pointIconValues[
        Object.keys(icons).findIndex(
          (name) =>
            name ===
            store.projects.selected?.reports.selected?.settings.iconName
        )
      ]
    "
    :values="pointIconValues"
  />
</template>

<i18n lang="yaml">
en:
  'circle': 'Circle'
  'triangle': 'Triangle'
  'square': 'Square'
  'rhombus': 'Rhombus'
  'flare': 'Flare'
  'pentagon': 'Pentagon'
  'hexagon': 'Hexagon'
  'hexagonAlt': 'Hexagon alt.'
  'heptagon': 'Heptagon'
  'octagon': 'Octagon'
fr:
  'circle': 'Cercle'
  'triangle': 'Triangle'
  'square': 'Carré'
  'rhombus': 'Losange'
  'flare': 'Éclat'
  'pentagon': 'Pentagone'
  'hexagon': 'Hexagone'
  'hexagonAlt': 'Hexagone alt.'
  'heptagon': 'Heptagone'
  'octagon': 'Octagone'
</i18n>
