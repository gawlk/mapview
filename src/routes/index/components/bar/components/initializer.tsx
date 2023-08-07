import { useI18n } from '@solid-primitives/i18n'
import localforage from 'localforage'

import { store } from '/src/store'

import {
  acceptedExtensions,
  downloadFile,
  fetchFileFromURL,
  importFile,
  snapshotKey,
} from '/src/scripts'

import { Button, DragAndDrop, classPropToString } from '/src/components'

interface Props {
  class?: ClassProp
}

export const Initializer = (props: Props) => {
  const [t] = useI18n()

  const [state, setState] = createStore({
    snapshot: null as File | null,
  })

  onMount(async () => {
    const snapshot: File | null = await localforage.getItem(snapshotKey)

    if (snapshot) {
      setState('snapshot', snapshot)
    }
  })

  const openFiles = async (files: FileList | null) => {
    const file = files?.[0]

    if (file) {
      store.importingFile = true

      store.selectedProject = await importFile(file)

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

    store.selectedProject = projects[0]

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
      <Show when={state.snapshot}>
        {(snapshot) => (
          <div class="flex space-x-2">
            <Button
              color="orange"
              onClick={() => openFiles([snapshot()] as unknown as FileList)}
              full
              leftIcon={IconTablerReload}
            >
              {t('Resume previous session')}
            </Button>
            <Button
              color="orange"
              onClick={() => downloadFile(snapshot())}
              icon={IconTablerFileDownload}
            />
          </div>
        )}
      </Show>
      <Button onClick={openDemo} full leftIcon={IconTablerPlayerPlay}>
        {t('Try demo')}
      </Button>
    </div>
  )
}
