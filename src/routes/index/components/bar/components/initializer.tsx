import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { acceptedExtensions, fetchFileFromURL, importFile } from '/src/scripts'

import { Button, DragAndDrop, classPropToString } from '/src/components'

interface Props {
  class?: ClassProp
}

export default (props: Props) => {
  const [t] = useI18n()

  const openFiles = async (files: FileList | null) => {
    const file = files?.[0]

    if (file) {
      store.importingFile = true

      store.projects.selected = await importFile(file)

      store.importingFile = false
    }
  }

  const openDemo = async () => {
    store.importingFile = true

    const demosHeavydyn = import.meta.glob('/src/assets/demos/heavydyn/*')

    const demosMaxidyn = import.meta.glob('/src/assets/demos/maxidyn/*')

    const demosMinidyn = import.meta.glob('/src/assets/demos/minidyn/*')

    const paths = await Promise.all(
      [
        ...Object.entries(demosHeavydyn),
        ...Object.entries(demosMaxidyn),
        ...Object.entries(demosMinidyn),
      ]
        .filter(([key, _]) =>
          acceptedExtensions.some((extension) => key.endsWith(extension))
        )
        .map(async ([_, value]) => String(((await value()) as any).default))
    )

    const projects = await Promise.all(
      paths.map(async (url) => await importFile(await fetchFileFromURL(url)))
    )

    store.projects.list.sort(
      (a, b) => projects.indexOf(a) - projects.indexOf(b)
    )

    store.projects.selected = projects[0]

    store.importingFile = false
  }

  return (
    <div class={classPropToString(['space-y-2', props.class])}>
      <DragAndDrop
        onInput={openFiles}
        accept={acceptedExtensions.join(', ')}
        buttonText={t('Open a file')}
      >
        {t('Drop a file here or click here to choose one')}
      </DragAndDrop>
      <Button onClick={openDemo} full leftIcon={IconTablerCarrot}>
        {t('Try demo')}
      </Button>
    </div>
  )
}
