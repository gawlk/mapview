import localforage from 'localforage'

import { Button, classPropToString, DragAndDrop } from '/src/components'
import { env } from '/src/env'
import { useAppState } from '/src/index'
import {
  acceptedExtensions,
  downloadFile,
  fetchFileFromURL,
  importFile,
  snapshotKey,
} from '/src/scripts'
import { store } from '/src/store'

interface Props {
  readonly class?: ClassProp
}

export const Initializer = (props: Props) => {
  const { t } = useAppState()

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
      store.importingFile.set(true)

      const project = await importFile(file)

      !env.isTest && console.log('project', project)

      store.pushAndSelectProject(project)

      store.importingFile.set(false)
    }
  }

  const openDemo = async () => {
    store.importingFile.set(true)

    const paths = await Promise.all(
      [
        import.meta.glob('/src/assets/demos/heavydyn/*'),
        import.meta.glob('/src/assets/demos/maxidyn/*'),
        import.meta.glob('/src/assets/demos/minidyn/*'),
        ...(env.isDev
          ? [
              import.meta.glob(
                '/src/assets/demos/heavydyn/.*.(prjz|dynz|mpvz)',
              ),
              import.meta.glob('/src/assets/demos/maxidyn/.*.(prjz|dynz|mpvz)'),
              import.meta.glob('/src/assets/demos/minidyn/.*.(prjz|dynz|mpvz)'),
            ]
          : []),
      ]
        .map((object) => Object.entries(object))
        .flat()
        .filter(([key]) =>
          acceptedExtensions.some((extension) => key.endsWith(extension)),
        )
        .map(async ([, value]) => String(((await value()) as AnyFile).default)),
    )

    const projects = (
      await Promise.all(
        paths.map(async (url) => importFile(await fetchFileFromURL(url))),
      )
    ).flatMap((project) => project || [])

    batch(() => {
      store.projects.list.set(projects)

      store.selectProject(projects[0])
    })

    store.importingFile.set(false)
  }

  return (
    <div class={classPropToString(['space-y-2', props.class])}>
      <DragAndDrop
        onInput={(fileList) => {
          void openFiles(fileList)
        }}
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
              onClick={() => {
                void openFiles([snapshot()] as unknown as FileList)
              }}
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
      <Button
        onClick={() => {
          void openDemo()
        }}
        full
        leftIcon={IconTablerPlayerPlay}
      >
        {t('Try demo')}
      </Button>
    </div>
  )
}
