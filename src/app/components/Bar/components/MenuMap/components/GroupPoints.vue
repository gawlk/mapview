<template>
  <div class="flex space-x-2">
    <Listbox
      full
      :icon="DotIcon"
      :preSelected="t('Point:')"
      :selected="state.pointStateValues[state.pointStateSelected]"
      :values="state.pointStateValues"
      @selectIndex="setPointsState"
      isTop
    />
    <Button
      @click="
        store.project.mapviewSettings.arePointsVisible =
          !store.project.mapviewSettings.arePointsVisible
      "
      :icon="
        store.project?.mapviewSettings.arePointsVisible ? EyeIcon : EyeOffIcon
      "
    />
    <Button
      @click="
        store.project.mapviewSettings.arePointsLinked =
          !store.project.mapviewSettings.arePointsLinked
      "
      :icon="
        store.project?.mapviewSettings.arePointsLinked ? ShareIcon : DotsIcon
      "
    />
    <Button
      @click="
        store.project.mapviewSettings.arePointsLocked =
          !store.project.mapviewSettings.arePointsLocked
      "
      :icon="
        store.project?.mapviewSettings.arePointsLocked
          ? LockClosedIcon
          : LockOpenIcon
      "
    />
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import {
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
    pointStateSelected: 0,
    pointStateValues: [t('Number'), t('Value'), t('Nothing')],
  })

  const setPointsState = (n: number) => {
    state.pointStateSelected = n

    if (store.project) {
      switch (n) {
        case 0:
          store.project.mapviewSettings.pointsState = 'number' as PointState
          break
        case 1:
          store.project.mapviewSettings.pointsState = 'value' as PointState
          break
        case 2:
          store.project.mapviewSettings.pointsState = 'nothing' as PointState
          break
      }
    }
  }
</script>

<i18n lang="yaml">
en:
  'Point:': 'Point:'
  'Display number within points': 'Display number within points'
  'Number': 'Number'
  'Value': 'Value'
  'Nothing': 'Nothing'
  'Show the value': 'Show the value'
  'Show the number': 'Show the number'
  'Show nothing': 'Show nothing'
fr:
  'Point:': 'Point :'
  'Display number within points': 'Afficher le nombre des points'
  'Number': 'Numéro'
  'Value': 'Valeur'
  'Nothing': 'Vide'
  'Show the value': 'Afficher la valeur'
  'Show the number': 'Afficher le numéro'
  'Show nothing': 'Ne rien afficher'
</i18n>
