import { DialogSelect } from '/src/components'
import { useAppState } from '/src/index'
import { store } from '/src/store'

export const SelectSource = () => {
  const { t } = useAppState()

  const selectedDataLabelGroups = createMemo(
    () => store.selectedReport?.dataLabels.groups,
  )

  return (
    <DialogSelect
      title="Select a source"
      attached
      button={{
        label: t('Source'),
        leftIcon: IconTablerListDetails,
        full: true,
      }}
      values={{
        selected: t(selectedDataLabelGroups()?.selected?.from || ''),
        list:
          (selectedDataLabelGroups()?.list as BaseDataLabelsGroups)
            .filter((parameters) => parameters.from !== 'Zone')
            .map((parameters, index) => ({
              value: String(index),
              text: t(parameters.from),
            })) || [],
      }}
      onClose={(value) =>
        value && selectedDataLabelGroups()?.selectIndex(Number(value))
      }
    />
  )
}
