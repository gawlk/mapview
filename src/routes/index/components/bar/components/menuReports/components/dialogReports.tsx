import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { icons } from '/src/scripts'

import ButtonFlyToReport from './buttonFlyToReport'
import ButtonReportVisibility from './buttonReportVisibility'
import SelectReportMarkerIcon from './selectReportMarkerIcon'

import { Button, Dialog } from '/src/components'

export default () => {
  const [t] = useI18n()

  const [state, setState] = createStore({
    hideAll: true,
  })

  return (
    <Dialog
      closeable
      title="Select a report"
      position="absolute"
      button={{
        label: t('Selected'),
        full: true,
        text: `${store.selectedReport?.name.value}`,
      }}
    >
      <div class="space-y-2">
        <Button
          leftIcon={IconTablerLayout2}
          rightIcon={state.hideAll ? IconTablerEyeOff : IconTablerEye}
          full
          onClick={() => {
            store.selectedProject?.reports.list.forEach(
              (report) => (report.settings.isVisible = !state.hideAll)
            )
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
                  {report.name.value.toString()}
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
