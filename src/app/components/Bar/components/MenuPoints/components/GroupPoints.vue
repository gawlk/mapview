<script setup lang="ts">
  import store from '/src/store'

  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconLockClosed from '~icons/heroicons-solid/lock-closed'
  import IconLockOpen from '~icons/heroicons-solid/lock-open'
  import IconShare from '~icons/heroicons-solid/share'
  import DotIcon from '/src/assets/svg/custom/dot.svg?component'
  import DotsIcon from '/src/assets/svg/custom/dots.svg?component'

  import Button from '/src/components/Button.vue'
  import Listbox from '/src/components/Listbox.vue'

  const { t } = useI18n()

  const state = reactive({
    pointStateSelected: 0,
    pointStateValues: [t('Number'), t('Value'), t('Nothing')],
  })

  const setPointsState = (n: number) => {
    state.pointStateSelected = n

    if (store.projects.selected) {
      switch (n) {
        case 0:
          store.projects.selected.settings.pointsState = 'number'
          break
        case 1:
          store.projects.selected.settings.pointsState = 'value'
          break
        case 2:
          store.projects.selected.settings.pointsState = 'nothing'
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
      :preSelected="`${t('Content')}${t(':')}`"
      :selected="state.pointStateValues[state.pointStateSelected]"
      :values="state.pointStateValues"
      @selectIndex="setPointsState"
    />
    <Button
      @click="
        store.projects.selected &&
          (store.projects.selected.settings.arePointsVisible =
            !store.projects.selected.settings.arePointsVisible)
      "
      :icon="
        store.projects.selected?.settings.arePointsVisible
          ? IconEye
          : IconEyeOff
      "
    />
    <Button
      @click="
        store.projects.selected &&
          (store.projects.selected.settings.arePointsLinked =
            !store.projects.selected.settings.arePointsLinked)
      "
      :icon="
        store.projects.selected?.settings.arePointsLinked ? IconShare : DotsIcon
      "
    />
    <Button
      @click="
        store.projects.selected &&
          (store.projects.selected.settings.arePointsLocked =
            !store.projects.selected.settings.arePointsLocked)
      "
      :icon="
        store.projects.selected?.settings.arePointsLocked
          ? IconLockClosed
          : IconLockOpen
      "
    />
  </div>
</template>

<i18n lang="yaml">
fr:
  'Display number within points': 'Afficher le nombre des points'
  'Show the value': 'Afficher la valeur'
  'Show the number': 'Afficher le numéro'
  'Show nothing': 'Ne rien afficher'
</i18n>
