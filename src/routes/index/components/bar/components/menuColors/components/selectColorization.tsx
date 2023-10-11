import { DialogSelect } from '/src/components'
import { useAppState } from '/src/index'
import { store } from '/src/store'

export const SelectColorization = () => {
  const { t } = useAppState()

  const possibilities: ReportColorization[] = ['Threshold', 'Zone']

  return (
    <DialogSelect
      title={t('Select a colorization')}
      button={{
        leftIcon: IconTablerColorSwatch,
        label: t('Colorization by'),
        full: true,
      }}
      attached
      values={{
        selected: t(store.selectedReport?.settings.colorization || ''),
        list: possibilities.map((possibility) => ({
          value: possibility,
          text: t(possibility),
        })),
      }}
      onClose={(value) => {
        value &&
          store.selectedReport &&
          (possibilities as string[]).includes(value) &&
          (store.selectedReport.settings.colorization =
            value as ReportColorization)
      }}
    />
  )
}
