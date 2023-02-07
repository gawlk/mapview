<script setup lang="ts">
  import store from '/src/store'

  import {
    acceptedExtensions,
    fetchFileFromURL,
    importFile,
  } from '/src/scripts'

  import IconBeaker from '~icons/heroicons-solid/beaker'

  import Button from '/src/components/Button.vue'
  import DragAndDrop from '/src/components/DragAndDrop.vue'

  const { t } = useI18n()

  const openFiles = async (files: FileList | null) => {
    const file = files?.[0]

    if (file) {
      store.projects.selected = await importFile(file)
    }
  }

  const openDemo = async () => {
    const demosHeavydyn = import.meta.glob('/src/assets/demos/heavydyn/*', {
      as: 'url',
    })

    const demosMaxidyn = import.meta.glob('/src/assets/demos/maxidyn/*', {
      as: 'url',
    })

    const demosMinidyn = import.meta.glob('/src/assets/demos/minidyn/*', {
      as: 'url',
    })

    const paths = [
      ...Object.keys(demosHeavydyn),
      ...Object.keys(demosMaxidyn),
      ...Object.keys(demosMinidyn),
    ].filter((path) =>
      acceptedExtensions.some((extension) => path.endsWith(extension))
    )

    const projects = await Promise.all(
      paths.map(async (url) => await importFile(await fetchFileFromURL(url)))
    )

    store.projects.list.sort(
      (a, b) => projects.indexOf(a) - projects.indexOf(b)
    )

    store.projects.selected = projects[0]
  }
</script>

<template>
  <div class="space-y-2">
    <DragAndDrop
      @input="openFiles"
      :accept="acceptedExtensions.join(', ')"
      :buttonText="t('Open a file')"
    >
      {{ t('Drop a file here or click here to choose one') }}
    </DragAndDrop>
    <Button @click="openDemo" full :leftIcon="IconBeaker">
      {{ t('Try demo') }}
    </Button>
    <!-- <a
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
    </a> -->
  </div>
</template>

<i18n lang="yaml">
fr:
  'Open a file': 'Ouvrir un fichier'
  'Drop a file here or click here to choose one': 'Glisser un fichier ici ou cliquer pour en choisir un'
  'Try demo': 'Essayer la demo'
  'Download templates': 'Télécharger les templates'
</i18n>
