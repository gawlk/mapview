import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { DialogSelect } from '/src/components'

export default () => {
  const [t] = useI18n()

  const possibilities: ReportColorization[] = ['Threshold', 'Zone']

  return (
    <DialogSelect
      title="Select a colorization"
      button={{
        label: t('Colorization by'),
        full: true,
      }}
      size="small"
      list={{
        selected: t(store.selectedReport?.settings.colorization || ''),
        values: possibilities.map((possibility) => ({
          value: possibility,
          label: t(possibility),
        })),
      }}
      onClose={(value) =>
        value &&
        store.selectedReport &&
        (possibilities as string[]).includes(value) &&
        (store.selectedReport.settings.colorization =
          value as ReportColorization)
      }
    />
  )
}
