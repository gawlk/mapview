<script setup lang="ts">
  import { importFile, acceptedExtensions } from '/src/scripts'

  import IconBeaker from '~icons/heroicons-solid/beaker'
  import IconSave from '~icons/heroicons-solid/save'
  import store from '/src/store'

  import Button from '/src/components/Button.vue'
  import DragAndDrop from '/src/components/DragAndDrop.vue'

  const { t } = useI18n()

  let demoHeavydyn: File | undefined
  let demoMaxidyn: File | undefined
  let demoMinidyn: File | undefined

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
    if (demoHeavydyn && demoMaxidyn && demoMinidyn) {
      const project = await importFile(demoMaxidyn)
      store.projects.selected = project

      importFile(demoHeavydyn)
      importFile(demoMinidyn)
    }
  }

  onMounted(async () => {
    demoHeavydyn = await getDemoFile('heavydyn/demo.prjz')
    demoMaxidyn = await getDemoFile('maxidyn/demo.prjz')
    demoMinidyn = await getDemoFile('minidyn/demo.dynz')
  })
</script>

<template>
  <div class="space-y-2">
    <DragAndDrop
      @input="openFiles"
      :accept="acceptedExtensions"
      :buttonText="t('Open a file')"
    >
      {{ t('Drop a file here or click here to choose one') }}
    </DragAndDrop>
    <Button @click="openDemo" full :leftIcon="IconBeaker">
      {{ t('Try demo') }}
    </Button>
    <a
      full
      download
      href="/demos/heavydyn/demo.prjz"
      target="_blank"
      rel="noopener noreferrer"
      :leftIcon="IconSave"
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
