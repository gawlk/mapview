import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { DialogSelect } from '/src/components'
import SpanDataLabel from '/src/components/global/spanDataLabel'

export default () => {
  const [t] = useI18n()

  const selectedDataLabelGroupChoices = createMemo(
    () => store.selectedReport?.dataLabels.groups.selected?.choices
  )

  console.log(selectedDataLabelGroupChoices()?.selectedIndex)

  return (
    <DialogSelect
      title="Select a label"
      position="relative"
      button={{
        label: t('Label'),
        leftIcon: IconTablerList,
        full: true,
      }}
      search={{}}
      options={{
        selected: selectedDataLabelGroupChoices()?.selectedIndex ?? null,
        list:
          selectedDataLabelGroupChoices()?.list.map((dataLabel, index) => ({
            value: String(index),
            text: () => <SpanDataLabel dataLabel={dataLabel} />,
          })) || [],
      }}
      onClose={(value) =>
        value && selectedDataLabelGroupChoices()?.selectIndex(Number(value))
      }
    />
  )
}
