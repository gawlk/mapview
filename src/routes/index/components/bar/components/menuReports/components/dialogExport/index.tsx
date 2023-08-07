import { useI18n } from '@solid-primitives/i18n'

import { store } from '/src/store'

import { getSimpleReportExports } from '/src/scripts'

import { Dialog, Navigator } from '/src/components'

import { MVRZ } from './components/mvrz'
import { REST } from './components/mvrz/components/rest'
import { initDemoTemplates } from './components/mvrz/components/template/scripts'
import { SimpleExporters } from './components/simpleExporters'

export const DialogExport = () => {
  const [t] = useI18n()

  const [state, setState] = createStore({
    template: null as File | null,
  })

  const simpleExports = createMemo(() => [
    ...(store.selectedReport
      ? getSimpleReportExports(
          store.selectedReport as unknown as MachineProject
        )
      : []),
  ])

  onMount(() => {
    createEffect(
      on(
        () => store.selectedProject?.machine,

        () => {
          const key = 'demo-templates-fetched'

          const fetched = localStorage.getItem(key)

          if (fetched !== 'true') {
            initDemoTemplates()

            localStorage.setItem(key, 'true')
          }
        }
      )
    )
  })

  return (
    <Dialog
      closeable
      button={{
        leftIcon: IconTablerCloudDownload,
        full: true,
        color: 'orange',
      }}
      title={t('Export report')}
    >
      <Navigator
        default="/list"
        list={[
          ...(simpleExports().length
            ? [
                {
                  id: '/list',
                  component: SimpleExporters,
                },
              ]
            : []),
          {
            id: '/mvrz',
            component: (props: NavigatorComponentProps) => (
              <MVRZ
                {...props}
                setTemplate={(file: File) => setState('template', file)}
              />
            ),
          },
          {
            id: '/mvrz/rest',
            component: (props: NavigatorComponentProps) => (
              <Show when={state.template}>
                {(file) => <REST {...props} template={file()} />}
              </Show>
            ),
          },
        ]}
      />
    </Dialog>
  )
}
