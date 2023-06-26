import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { groupDataLabelsByCategory, moveIndexInCopiedArray } from '/src/scripts'

import SortableDataLabel from './sortableDataLabel'

import {
  Button,
  DialogDivider,
  DialogOptions,
  Label,
  SpanDataLabel,
} from '/src/components'
import SortableListDataLabels from './sortableListDataLabels'

export default () => {
  const [t] = useI18n()

  const tableDataLabels = createMemo(
    () => store.selectedReport?.dataLabels.table.selected
  )

  const tableSelectedDataLabels = createMemo(
    () => tableDataLabels()?.dataLabels
  )

  const tableDataLabelsChoices = createMemo(
    () => tableDataLabels()?.group.choices.list
  )

  const groupedTableDataLabelsChoices = createMemo(() =>
    groupDataLabelsByCategory(tableDataLabelsChoices() || [])
  )

  let selectedDataLabels: HTMLDivElement | undefined

  // const { oldIndex, newIndex } = event.data

  // const tableSelected = tableDataLabels()

  // if (tableSelected?.dataLabels) {
  //   tableSelected.dataLabels = moveIndexInCopiedArray(
  //     tableSelected.dataLabels,
  //     oldIndex,
  //     newIndex
  //   )
  // }

  const optionsList = createMemo(
    () =>
      groupedTableDataLabelsChoices().map(([category, dataLabels]) => ({
        name: t(category.name),
        list: dataLabels.map((dataLabel) => {
          const index = createMemo(
            () => tableSelectedDataLabels()?.indexOf(dataLabel) ?? -1
          )

          const selected = createMemo(() => index() !== -1)

          return {
            value: dataLabel.toString(),
            get label() {
              return selected() ? `${index() + 1}` : ''
            },
            text: () => <SpanDataLabel dataLabel={dataLabel} />,
            // Magical next line
            get rightIcon() {
              return selected() ? IconTablerMinus : IconTablerPlus
            },
          }
        }),
      })) || []
  )

  return (
    <div class="space-y-4">
      <div class="space-y-2">
        <Label label={t('Selected columns')}>
          <SortableListDataLabels />
        </Label>
      </div>

      <DialogDivider class="-mx-4 mt-3" />

      <DialogOptions
        onClick={(value) => {
          const findFn = (dataLabel: DataLabel) =>
            dataLabel.toString() === value

          const dataLabel = tableDataLabelsChoices()?.find(findFn)

          const _tableSelectedDataLabels = tableSelectedDataLabels()

          if (!dataLabel || !_tableSelectedDataLabels) return

          const index = _tableSelectedDataLabels.indexOf(dataLabel)

          if (index === -1) {
            _tableSelectedDataLabels.push(dataLabel)
          } else {
            _tableSelectedDataLabels.splice(index, 1)
          }
        }}
        options={{
          selected: null,
          list: optionsList(),
        }}
      />
    </div>
  )
}
