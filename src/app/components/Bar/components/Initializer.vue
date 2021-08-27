<template>
  <div class="space-y-2">
    <DragAndDrop
      @input="openFiles"
      accept=".rptz, .dynz, .txt"
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
  import { createProject } from '/src/scripts/project/project'

  import { Button, DragAndDrop } from '/src/components'
  import {
    VideoCameraIcon,
    ShoppingCartIcon,
    TruckIcon,
  } from '@heroicons/vue/solid'

  const { t } = useI18n()

  const openFiles = () => {
    initProject()
  }

  const openMinidynDemo = () => {
    initProject()
  }

  const openHeavydynDemo = () => {
    initProject()
  }

  const openMaxidynDemo = () => {
    initProject()
  }

  const initProject = () => {
    const interval = setInterval(() => {
      if (store.map?.isStyleLoaded()) {
        store.project = createProject('test project', store.map)
        clearInterval(interval)
      }
    }, 100)
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
