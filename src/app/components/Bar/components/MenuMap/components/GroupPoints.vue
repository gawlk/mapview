<template>
  <div class="flex space-x-2">
    <Listbox
      full
      :icon="DotIcon"
      :preSelected="t('Point:')"
      :selected="state.values[state.selected]"
      :values="state.values"
      @selectIndex="setPointsState"
    />
    <Button
      @click="store.project.arePointsVisible = !store.project.arePointsVisible"
      :icon="store.project?.arePointsVisible ? EyeIcon : EyeOffIcon"
    />
  </div>
  <div class="flex space-x-2">
    <Listbox
      full
      :icon="ColorSwatchIcon"
      :preSelected="t('Icon:')"
      selected="Type 1"
      :values="state.values"
    />
    <Button
      @click="store.project.arePointsLinked = !store.project.arePointsLinked"
      :icon="store.project?.arePointsLinked ? ShareIcon : DotsIcon"
    />
    <Button
      @click="store.project.arePointsLocked = !store.project.arePointsLocked"
      :icon="store.project?.arePointsLocked ? LockClosedIcon : LockOpenIcon"
    />
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import {
    ColorSwatchIcon,
    EyeIcon,
    EyeOffIcon,
    LockClosedIcon,
    LockOpenIcon,
    ShareIcon,
  } from '@heroicons/vue/solid'

  import DotIcon from '/src/assets/svg/custom/dot.svg?component'
  import DotsIcon from '/src/assets/svg/custom/dots.svg?component'
  import { Button, Listbox } from '/src/components'

  const { t } = useI18n()

  const state = reactive({
    selected: 0,
    values: [t('Show the number'), t('Show the value'), t('Show nothing')],
  })

  const setPointsState = (n: number) => {
    state.selected = n

    if (store.project) {
      switch (n) {
        case 0:
          store.project.pointsState = 'number' as PointsState
          break
        case 1:
          store.project.pointsState = 'value' as PointsState
          break
        case 2:
          store.project.pointsState = 'nothing' as PointsState
          break
      }
    }
  }
</script>

<i18n lang="yaml">
en:
  'Icon:': 'Icon:'
  'Point:': 'Point:'
  'Display number within points': 'Display number within points'
  'Show the value': 'Show the value'
  'Show the number': 'Show the number'
  'Show nothing': 'Show nothing'
fr:
  'Icon:': 'Icône :'
  'Point:': 'Point :'
  'Display number within points': 'Afficher le nombre des points'
  'Show the value': 'Afficher la valeur'
  'Show the number': 'Afficher le numéro'
  'Show nothing': 'Ne rien afficher'
</i18n>
