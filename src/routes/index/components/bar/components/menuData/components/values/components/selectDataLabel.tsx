import { useI18n } from '@solid-primitives/i18n'

import { DialogSelect, SpanDataLabel } from '/src/components'
import { groupDataLabelsByCategory } from '/src/scripts'
import { store } from '/src/store'

export const SelectDataLabel = () => {
  const [t] = useI18n()

  const selectedDataLabelGroupChoices = createMemo(
    () => store.selectedReport?.dataLabels.groups.selected?.choices,
  )

  const groupedDataLabels = createMemo(
    () =>
      groupDataLabelsByCategory(
        selectedDataLabelGroupChoices()?.list || [],
      ).map(([category, dataLabels]) => ({
        name: category.name,
        list: dataLabels.map((dataLabel) => ({
          value: dataLabel.toString(),
          text: () => <SpanDataLabel dataLabel={dataLabel} />,
        })),
      })) || [],
  )

  return (
    <DialogSelect
      title="Select a label"
      button={{
        label: t('Label'),
        leftIcon: IconTablerListSearch,
        text: () => (
          <Show when={selectedDataLabelGroupChoices()?.selected}>
            {(dataLabel) => (
              <SpanDataLabel dataLabel={dataLabel()} includeCategory />
            )}
          </Show>
        ),
        full: true,
      }}
      search={{}}
      values={{
        selected: selectedDataLabelGroupChoices()?.selected?.toString() ?? null,
        list: groupedDataLabels(),
      }}
      onClose={(value) =>
        value &&
        selectedDataLabelGroupChoices()?.selectFind(value, (dataLabel) =>
          dataLabel.toString(),
        )
      }
    />
  )
}
