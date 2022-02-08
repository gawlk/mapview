<script setup lang="ts">
  import store from '/src/store'

  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconLockClosed from '~icons/heroicons-solid/lock-closed'
  import IconLockOpen from '~icons/heroicons-solid/lock-open'
  import IconShare from '~icons/heroicons-solid/share'
  import DotIcon from '/src/assets/svg/custom/dot.svg?component'
  import DotsIcon from '/src/assets/svg/custom/dots.svg?component'

  const { t } = useI18n()

  const state = reactive({
    pointStateSelected: 0,
    pointStateValues: [t('Number'), t('Value'), t('Nothing')],
  })

  const setPointsState = (n: number) => {
    state.pointStateSelected = n

    if (store.selectedProject) {
      switch (n) {
        case 0:
          store.selectedProject.mapviewSettings.pointsState =
            'number' as PointsState
          break
        case 1:
          store.selectedProject.mapviewSettings.pointsState =
            'value' as PointsState
          break
        case 2:
          store.selectedProject.mapviewSettings.pointsState =
            'nothing' as PointsState
          break
      }
    }
  }
</script>

<template>
  <div class="flex space-x-2">
    <Listbox
      full
      :icon="DotIcon"
      :preSelected="`${t('Point')}${t(':')}`"
      :selected="state.pointStateValues[state.pointStateSelected]"
      :values="state.pointStateValues"
      @selectIndex="setPointsState"
    />
    <Button
      @click="
        store.selectedProject &&
          (store.selectedProject.mapviewSettings.arePointsVisible =
            !store.selectedProject.mapviewSettings.arePointsVisible)
      "
      :icon="
        store.selectedProject?.mapviewSettings.arePointsVisible
          ? IconEye
          : IconEyeOff
      "
    />
    <Button
      @click="
        store.selectedProject &&
          (store.selectedProject.mapviewSettings.arePointsLinked =
            !store.selectedProject.mapviewSettings.arePointsLinked)
      "
      :icon="
        store.selectedProject?.mapviewSettings.arePointsLinked
          ? IconShare
          : DotsIcon
      "
    />
    <Button
      @click="
        store.selectedProject &&
          (store.selectedProject.mapviewSettings.arePointsLocked =
            !store.selectedProject.mapviewSettings.arePointsLocked)
      "
      :icon="
        store.selectedProject?.mapviewSettings.arePointsLocked
          ? IconLockClosed
          : IconLockOpen
      "
    />
  </div>
</template>

<i18n lang="yaml">
en:
  'Display number within points': 'Display number within points'
  'Show the value': 'Show the value'
  'Show the number': 'Show the number'
  'Show nothing': 'Show nothing'
fr:
  'Display number within points': 'Afficher le nombre des points'
  'Show the value': 'Afficher la valeur'
  'Show the number': 'Afficher le numéro'
  'Show nothing': 'Ne rien afficher'
</i18n>
