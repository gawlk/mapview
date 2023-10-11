import { Button, Dialog } from '/src/components'
import { env } from '/src/env'
import { useAppState } from '/src/index'
import { hasRawData } from '/src/scripts'
import { store } from '/src/store'

import { ButtonReportVisibility } from './buttonReportVisibility'
import { SelectReportMarkerIcon } from './selectReportMarkerIcon'

export const DialogReports = () => {
  const { t } = useAppState()

  const [state, setState] = createStore({
    hideAll: true,
  })

  const convertReportToName = (report: MachineReport | null) =>
    env.isDev && report && hasRawData(report)
      ? `${report?.name.toString()} - Raw data`
      : `${report?.name.toString()}`

  return (
    <Dialog
      closeable
      title={t('Select a report')}
      attached
      button={{
        label: t('Selected'),
        full: true,
        text: convertReportToName(store.selectedReport),
      }}
    >
      <div class="space-y-2">
        <Button
          leftIcon={IconTablerLayout2}
          rightIcon={state.hideAll ? IconTablerEyeOff : IconTablerEye}
          full
          onClick={() => {
            store.selectedProject?.reports.list.forEach((report) => {
              report.settings.isVisible = !state.hideAll
            })
            setState('hideAll', !state.hideAll)
          }}
        >
          <span class="flex-1 text-left">
            {t(state.hideAll ? 'Hide all' : 'Show all')}
          </span>
        </Button>
        <For each={store.selectedProject?.reports.list}>
          {(report, index) => (
            <div class="flex space-x-1">
              <SelectReportMarkerIcon report={report} />
              <Button
                label={String(index() + 1)}
                rightIcon={IconTablerZoomIn}
                onClick={() => {
                  if (store.selectedProject) {
                    store.selectedReport = report
                    report.fitOnMap()
                  }
                }}
                full
              >
                <span class="flex-1 text-left">
                  {convertReportToName(report)}
                </span>
              </Button>
              <ButtonReportVisibility report={report} />
            </div>
          )}
        </For>
      </div>
    </Dialog>
  )
}
