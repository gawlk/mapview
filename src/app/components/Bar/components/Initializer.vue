<script setup lang="ts">
  import { importFile } from '/src/scripts'

  import IconBeaker from '~icons/heroicons-solid/beaker'
  import IconSave from '~icons/heroicons-solid/save'
  import store from '/src/store'

  import Button from '/src/components/Button.vue'
  import DragAndDrop from '/src/components/DragAndDrop.vue'

  const { t } = useI18n()

  const openFiles = async (files: FileList | null) => {
    const file = files?.[0]

    if (file) {
      store.projects.selected = await importFile(file)
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
    // const demoMaxidyn = await getDemoFile('maxidyn/demo.prjz')
    const demoMinidyn = await getDemoFile('minidyn/demo.dynz')

    const projectHeavydyn = await importFile(demoHeavydyn)
    // const projectMaxidyn = await importFile(demoMaxidyn)
    const projectMinidyn = await importFile(demoMinidyn)

    console.log(projectHeavydyn)

    store.projects.selected = projectHeavydyn
  }

  const downloadTemplates = () => {}
</script>

<template>
  <div class="space-y-2">
    <DragAndDrop
      @input="openFiles"
      accept=".prjz, .mpvz, .dynz, .json"
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
      class="group inline-flex w-full cursor-pointer items-center space-x-2 rounded-lg bg-gray-100 py-2 px-4 text-sm font-medium leading-6 text-gray-900 transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-50"
    >
      <IconHeroiconsSolidDownload
        class="h-5 w-5 text-gray-400 group-hover:text-gray-500"
      />
      <span>
        {{ t('Download templates') }}
      </span>
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
