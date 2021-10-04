<template>
  <div class="space-y-2">
    <DragAndDrop
      @input="openFiles"
      accept=".json, .prjz"
      :buttonText="t('Open a file')"
    >
      {{ t('Drop a file here or click here to choose one') }}
    </DragAndDrop>
    <Button
      @click="openMinidynDemo"
      full
      :leftIcon="VideoCameraIcon"
      iconsClasses="-rotate-90"
    >
      {{ t('Try Minidyn demo') }}
    </Button>
    <Button @click="openHeavydynDemo" full :leftIcon="ShoppingCartIcon">
      {{ t('Try Heavydyn demo') }}
    </Button>
    <Button @click="openMaxidynDemo" full :leftIcon="TruckIcon">
      {{ t('Try Maxidyn demo') }}
    </Button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'
  import { importFile } from '/src/scripts'

  import { Button, DragAndDrop } from '/src/components'
  import {
    VideoCameraIcon,
    ShoppingCartIcon,
    TruckIcon,
  } from '@heroicons/vue/solid'

  const { t } = useI18n()

  const openFiles = (files: File[]) => {
    const file = files[0]

    if (file) {
      importFile(file)
    }
  }

  const getDemoFile = async (machineName: MachineName) => {
    const url = `${window.location.href}/demos/${machineName}/demo.prjz`

    const response = await fetch(url)

    const blob = await response.blob()

    return new File([blob], `${machineName}.prjz`)
  }

  const openMinidynDemo = async () => {
    const file = await getDemoFile('minidyn')

    importFile(file)
  }

  const openHeavydynDemo = async () => {
    const file = await getDemoFile('minidyn')

    importFile(file)
  }

  const openMaxidynDemo = async () => {
    const file = await getDemoFile('minidyn')

    importFile(file)
  }
</script>

<i18n lang="yaml">
en:
  'Open a file': 'Open a file'
  'Drop a file here or click here to choose one': 'Drop a file here or click here to choose one'
  'Try Minidyn demo': 'Try Minidyn demo'
  'Try Heavydyn demo': 'Try Heavydyn demo'
  'Try Maxidyn demo': 'Try Maxidyn demo'
fr:
  'Open a file': 'Ouvrir un fichier'
  'Drop a file here or click here to choose one': 'Glisser un fichier ici ou cliquer pour en choisir un'
  'Try Minidyn demo': 'Essayer la demo Minidyn'
  'Try Heavydyn demo': 'Essayer la demo Heavydyn'
  'Try Maxidyn demo': 'Essayer la demo Maxidyn'
</i18n>
