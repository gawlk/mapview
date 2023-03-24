import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { icons } from '/src/scripts'

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
      title="Select a report"
      position="relative"
      button={{
        label: t('Selected'),
        full: true,
        text: `${store.projects.selected?.reports.selected?.name.value}`,
      }}
    >
      <div class="space-y-2">
        <Button
          leftIcon={IconTablerLayout2}
          rightIcon={state.hideAll ? IconTablerEyeOff : IconTablerEye}
          full
          onClick={() => {
            store.projects.selected?.reports.list.forEach(
              (report) => (report.settings.isVisible = !state.hideAll)
            )
            setState('hideAll', !state.hideAll)
          }}
        >
          <span class="flex-1 text-left">
            {t(state.hideAll ? 'Hide all' : 'Show all')}
          </span>
        </Button>
        <For each={store.projects.selected?.reports.list}>
          {(report) => (
            <div class="flex space-x-1">
              <SelectReportMarkerIcon report={report} />
              <Button
                onClick={() => {
                  if (store.projects.selected) {
                    store.projects.selected.reports.selected = report
                    report.fitOnMap()
                  }
                }}
                full
              >
                {report.name.value.toString()}
              </Button>
              <ButtonReportVisibility report={report} />
            </div>
          )}
        </For>
      </div>
    </Dialog>
  )
}
