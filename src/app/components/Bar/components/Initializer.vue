<script setup lang="ts">
  import { importFile } from '/src/scripts'

  import IconBeaker from '~icons/heroicons-solid/beaker'
  import IconSave from '~icons/heroicons-solid/save'
  import store from '/src/store'

  import Button from '/src/components/Button.vue'
  import DragAndDrop from '/src/components/DragAndDrop.vue'

  const { t } = useI18n()

  const openFiles = (files: FileList | null) => {
    const file = files?.[0]

    if (file) {
      importFile(file)
    }
  }

  const getDemoFile = async (path: string) => {
    const url = `${window.location.href}/demos/${path}`

    const response = await fetch(url)

    const blob = await response.blob()

    return new File([blob], path.split('/').pop() as string)
  }

  const openDemo = async () => {
    const demoHeavydyn = await getDemoFile('heavydyn/demo.prjz')
    const demoMaxidyn = await getDemoFile('maxidyn/demo.prjz')
    const demoMinidyn = await getDemoFile('minidyn/demo.dynz')

    const projectHeavydyn = await importFile(demoHeavydyn)
    const projectMaxidyn = await importFile(demoMaxidyn)
    const projectMinidyn = await importFile(demoMinidyn)

    store.projects.selected = projectHeavydyn
  }

  const downloadTemplates = () => {}
</script>

<template>
  <div class="space-y-2">
    <DragAndDrop
      @input="openFiles"
      accept=".prjz, .mpvz"
      :buttonText="t('Open a file')"
    >
      {{ t('Drop a file here or click here to choose one') }}
    </DragAndDrop>
    <Button @click="openDemo" full :leftIcon="IconBeaker">
      {{ t('Try demo') }}
    </Button>
    <a
      @click="downloadTemplates"
      full
      :leftIcon="IconSave"
      href="/public/demos/templates.zip"
      download
    >
      {{ t('Download templates') }}
    </a>
  </div>
</template>

<i18n lang="yaml">
fr:
  'Open a file': 'Ouvrir un fichier'
  'Drop a file here or click here to choose one': 'Glisser un fichier ici ou cliquer pour en choisir un'
  'Try demo': 'Essayer la demo'
  'Download templates': 'Télécharger les templates'
</i18n>
