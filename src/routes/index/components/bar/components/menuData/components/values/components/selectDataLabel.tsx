import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { groupDataLabelsByCategory } from '/src/scripts'

import { DialogSelect, SpanDataLabel } from '/src/components'

export default () => {
  const [t] = useI18n()

  const selectedDataLabelGroupChoices = createMemo(
    () => store.selectedReport?.dataLabels.groups.selected?.choices
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
        list:
          groupDataLabelsByCategory(
            selectedDataLabelGroupChoices()?.list || []
          ).map(([category, dataLabels]) => ({
            name: t(category.name),
            list: dataLabels.map((dataLabel) => ({
              value: dataLabel.toString(),
              text: () => <SpanDataLabel dataLabel={dataLabel} />,
            })),
          })) || [],
      }}
      onClose={(value) =>
        value &&
        selectedDataLabelGroupChoices()?.selectFind(value, (dataLabel) =>
          dataLabel.toString()
        )
      }
    />
  )
}
