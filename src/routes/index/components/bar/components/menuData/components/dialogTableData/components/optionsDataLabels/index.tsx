import {
  DialogDivider,
  DialogOptions,
  Label,
  SortableList,
  SpanDataLabel,
} from '/src/components'
import { useAppState } from '/src/index'
import { groupDataLabelsByCategory, moveIndexInCopiedArray } from '/src/scripts'
import { store } from '/src/store'

import { SortableDataLabel } from '../sortableDataLabel'
import { insertHeavydynDataLabel } from './scripts'
import { insertMaxidynDataLabel } from './scripts/maxidyn'
import { insertMinidynDataLabel } from './scripts/minidyn'

export const OptionsDataLabels = () => {
  const { t } = useAppState()

  const tableDataLabels = createMemo(
    () => store.selectedReport()?.dataLabels.table.selected(),
  )

  const tableSelectedDataLabels = createMemo(
    () => tableDataLabels()?.dataLabels,
  )

  const tableDataLabelsChoices = createMemo(
    () => tableDataLabels()?.group.choices.list(),
  )

  const groupedTableDataLabelsChoices = createMemo(() =>
    groupDataLabelsByCategory(tableDataLabelsChoices() || []),
  )

  const optionsList = createMemo(
    () =>
      groupedTableDataLabelsChoices().map(([category, dataLabels]) => ({
        name: category.name,
        list: dataLabels.map((dataLabel) => {
          const index = createMemo(
            () => tableSelectedDataLabels()?.()?.indexOf(dataLabel) ?? -1,
          )

          const selected = createMemo(() => index() !== -1)

          return {
            value: dataLabel.toString(),
            get label() {
              return selected() ? `${index() + 1}` : ''
            },
            text: () => <SpanDataLabel dataLabel={dataLabel} />,
            get rightIcon() {
              return selected() ? IconTablerMinus : IconTablerPlus
            },
          }
        }),
      })) || [],
  )

  return (
    <div class="space-y-4">
      <div class="space-y-2">
        <Label label={t('Selected')}>
          <SortableList
            orientation="vertical"
            list={tableSelectedDataLabels()?.() || []}
            itemToId={(dataLabel) => dataLabel.getSerializedName()}
            onChange={(oldIndex, newIndex) => {
              const tableSelected = tableDataLabels()

              if (tableSelected?.dataLabels) {
                tableSelected.dataLabels.set(
                  moveIndexInCopiedArray(
                    tableSelected.dataLabels(),
                    oldIndex,
                    newIndex,
                  ),
                )
              }
            }}
            component={(ref, dataLabel, index) => (
              <SortableDataLabel
                ref={ref}
                dataLabel={dataLabel}
                index={index}
                tableSelectedDataLabels={tableSelectedDataLabels()?.() || []}
              />
            )}
          />
        </Label>
      </div>

      <DialogDivider class="-mx-4 mt-3" />

      <DialogOptions
        onClick={(value) => {
          const dataLabel = tableDataLabelsChoices()?.find(
            (_dataLabel) => _dataLabel.toString() === value,
          )

          const _tableSelectedDataLabelsList =
            tableSelectedDataLabels()?.() || []

          if (!dataLabel || !_tableSelectedDataLabelsList) return

          const index = _tableSelectedDataLabelsList.indexOf(dataLabel)

          tableSelectedDataLabels()?.set(() => {
            if (index === -1) {
              switch (store.selectedProject()?.machine) {
                case 'Heavydyn':
                  return insertHeavydynDataLabel(
                    dataLabel,
                    _tableSelectedDataLabelsList,
                  )
                case 'Maxidyn':
                  return insertMaxidynDataLabel(
                    dataLabel,
                    _tableSelectedDataLabelsList,
                  )
                case 'Minidyn':
                  return insertMinidynDataLabel(
                    dataLabel,
                    _tableSelectedDataLabelsList,
                  )
              }
            }

            _tableSelectedDataLabelsList.splice(index, 1)

            return _tableSelectedDataLabelsList
          })
        }}
        options={{
          selected: null,
          list: optionsList(),
        }}
      />
    </div>
  )
}
