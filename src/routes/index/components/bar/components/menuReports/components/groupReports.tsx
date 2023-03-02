import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { icons } from '/src/scripts'

import { Button, Dialog } from '/src/components'

export default () => {
  const [t] = useI18n()

  const [state, setState] = createStore({
    hideAll: true,
  })

  return (
    <div>
      <Dialog
        title="Select a report"
        size="small"
        button={{
          leftIcon: IconTablerList,
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
                <Button
                  leftIcon={icons[report.settings.iconName]}
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
                <Button
                  icon={
                    report.settings.isVisible ? IconTablerEye : IconTablerEyeOff
                  }
                  onClick={() => {
                    report.settings.isVisible = !report.settings.isVisible
                  }}
                />
              </div>
            )}
          </For>
        </div>
      </Dialog>
    </div>
  )
}
