<template>
  <Disclosure :icon="DotsIcon" :text="t('Points')">
    <div class="flex space-x-2">
      <Listbox
        full
        :icon="DotIcon"
        :selected="state.values[state.selected]"
        :values="state.values"
      />
      <Button
        @click="store.project.linkPoints = !store.project.linkPoints"
        :icon="store.project?.linkPoints ? EyeIcon : EyeOffIcon"
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
        @click="store.project.linkPoints = !store.project.linkPoints"
        :icon="store.project?.linkPoints ? ShareIcon : DotsIcon"
      />
      <Button
        @click="store.project.lockPoints = !store.project.lockPoints"
        :icon="store.project?.lockPoints ? LockClosedIcon : LockOpenIcon"
      />
    </div>
  </Disclosure>
</template>

<script setup>
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

  import DotIcon from '/src/assets/svg/custom/dot.svg'
  import DotsIcon from '/src/assets/svg/custom/dots.svg'
  import { Button, Disclosure, Listbox } from '/src/components'

  const { t } = useI18n()

  const state = reactive({
    selected: 0,
    values: [t('Show the value'), t('Show the number')],
  })
</script>

<i18n lang="yaml">
en:
  'Points': 'Points'
  'Icon:': 'Icon:'
  'Display number within points': 'Display number within points'
  'Show the value': 'Show the value'
  'Show the number': 'Show the number'
fr:
  'Points': 'Points'
  'Icon:': 'Icône:'
  'Display number within points': 'Afficher le nombre des points'
  'Show the value': 'Affiché la valeur'
  'Show the number': 'Affiché le numéro'
</i18n>
