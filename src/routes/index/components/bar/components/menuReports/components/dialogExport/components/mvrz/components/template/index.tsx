import localForage from 'localforage'

import { Button, ButtonFile } from '/src/components'
import { useAppState } from '/src/index'
import { downloadFile } from '/src/scripts'
import { store } from '/src/store'

import { getTemplateKey } from './scripts'

interface Props extends NavigatorComponentProps {
  index: number
  setTemplate: (file: File) => void
}

export const Template = (props: Props) => {
  const [state, setState] = createStore({
    file: null as File | null,
  })

  const { t } = useAppState()

  const key = createMemo(() =>
    getTemplateKey(
      store.selectedProject?.machine as MachineName,
      props.index + 1,
    ),
  )

  createEffect(async () => {
    const file: AnyFile = await localForage.getItem(key())

    setState('file', file || null)
  })

  const updateFile = async (file: File | undefined) => {
    if (file) {
      setState('file', file)

      await localForage.setItem(key(), file)
    }
  }

  const remove = () => {
    setState('file', null)

    void localForage.removeItem(key())
  }

  return (
    <Show
      when={state.file}
      fallback={
        <ButtonFile
          leftIcon={IconTablerFileImport}
          label={`${t('Template')} ${props.index + 1}`}
          onFiles={(files) => updateFile(files?.[0])}
          full
          color="secondary"
        >
          <span class="flex-1 text-left">{t('No file')}</span>
        </ButtonFile>
      }
    >
      {(file) => (
        <div class="flex space-x-1">
          <Button
            leftIcon={IconTablerFileSpreadsheet}
            rightIcon={IconTablerChevronRight}
            full
            label={`${t('Template')} ${props.index + 1}`}
            onClick={() => {
              props.setTemplate(file())
              props.next('/mvrz/rest')
            }}
          >
            <span class="flex-1 text-left">{file().name}</span>
          </Button>
          <Button
            icon={IconTablerDownload}
            onClick={() => downloadFile(file())}
          />
          <Button color="red" icon={IconTablerTrash} onClick={remove} />
        </div>
      )}
    </Show>
  )
}
