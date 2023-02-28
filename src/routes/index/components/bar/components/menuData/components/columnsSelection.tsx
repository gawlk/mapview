import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { DialogSelect } from '/src/components'

export default () => {
  const [t] = useI18n()

  const tableDataLabels = createMemo(
    () => store.projects.selected?.reports.selected?.dataLabels.table
  )

  const selectDataLabel = (index: number) => {
    const dataLabel = tableDataLabels()?.selected?.group.choices.list[index]

    if (dataLabel) {
      const index = tableDataLabels()?.selected?.dataLabels.findIndex(
        (dataLabel2) => dataLabel === dataLabel2
      )
      if (typeof index === 'number') {
        index === -1
          ? tableDataLabels()?.selected?.dataLabels.push(dataLabel)
          : tableDataLabels()?.selected?.dataLabels.splice(index, 1)
      }
    }
  }
  return (
    <>
      <DialogSelect
        title="Select a source"
        button={{
          label: t('Source'),
          leftIcon: IconTablerList,
          full: true,
        }}
        list={{
          selected: tableDataLabels()?.selected?.group.from || '',
          values:
            tableDataLabels()
              ?.list.filter(
                (parameters) => parameters.group.choices.list.length
              )
              .map((parameters, index) => ({
                value: String(index),
                label: t(parameters.group.from),
              })) || [],
        }}
        onClose={(value) =>
          value && tableDataLabels()?.selectIndex(Number(value))
        }
      />

      {/* <Show when={tableDataLabels()?.selected?.group.from === 'Drop'}>
        <DialogSelect
          title="Select a source"
          button={{
            label: t('Source'),
            leftIcon: IconDotsVertical,
            full: true,
          }}
          list={{
            selected: tableDataLabels()?.selected?.group.from || '',
            values:
              tableDataLabels()
                ?.list.filter(
                  (parameters) => parameters.group.choices.list.length
                )
                .map((parameters, index) => ({
                  value: String(index),
                  label: t(parameters.group.from),
                })) || [],
          }}
          onClose={(value) =>
            value && tableDataLabels()?.selectIndex(Number(value))
          }
        />
      </Show> */}
      {/* <Select
    v-if="tableDataLabels?.selected?.group.from === 'Drop'"
    :icon="IconDotsVertical"
    :values="
      (tableDataLabels?.selected?.group.indexes?.list as MachineDropIndex[]).map(
        (index) =>
          `${index.displayedIndex} - ${t(index.type)}${
            index.machine === 'Heavydyn' && index.value
              ? ` (${index.value.displayedStringWithUnit})`
              : ''
          }`
      )
    "
    :preSelected="`${t('Index')}${t(':')}`"
    :selectedIndex="(tableDataLabels?.selected?.index?.displayedIndex || 1) - 1"
    @selectIndex="
      (index) =>
        tableDataLabels?.selected &&
        tableDataLabels?.selected?.group.from === 'Drop' &&
        (tableDataLabels.selected.index =
          tableDataLabels?.selected?.group.indexes.list[index])
    "
    full
  />
  <Select
    v-if="tableDataLabels?.selected"
    multiple
    :icon="IconViewBoards"
    :values="
      tableDataLabels?.selected?.group.choices.list.map((dataLabel) =>
        dataLabel.getDisplayedName()
      )
    "
    :preSelected="`${t('Columns')}${t(':')}`"
    :selectedList="
      tableDataLabels.selected.dataLabels.map((dataLabel) =>
        dataLabel.getDisplayedName()
      )
    "
    @selectIndex="selectDataLabel"
    @unselectIndex="selectDataLabel"
    full
      /> */}
    </>
  )
}
