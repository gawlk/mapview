import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { DialogSelect } from '/src/components'

export default () => {
  const [t] = useI18n()

  const selectedDataLabelGroups = createMemo(
    () => store.selectedReport?.dataLabels.groups
  )

  return (
    <DialogSelect
      title="Select a source"
      position="relative"
      button={{
        label: t('Source'),
        full: true,
      }}
      options={{
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