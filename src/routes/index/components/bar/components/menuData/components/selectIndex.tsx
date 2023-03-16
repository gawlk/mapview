import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { DialogSelect } from '/src/components'

export default () => {
  const [t] = useI18n()

  const selectedTableParams = createMemo(
    () => store.selectedReport?.dataLabels.table.selected
  )

  const dropIndexToString = (dropIndex: MachineDropIndex) =>
    `${dropIndex.displayedIndex} - ${t(dropIndex.type)}${
      dropIndex.machine === 'Heavydyn' && dropIndex.value
        ? ` (${dropIndex.value.displayedStringWithUnit})`
        : ''
    }`

  return (
    <Show when={selectedTableParams()?.group.from === 'Drop'}>
      {() => {
        const dropTableParams = selectedTableParams()
        const dropGroup =
          dropTableParams?.group as BaseDropDataLabelsGroup<BaseDropIndex>

        return (
          <DialogSelect
            title="Select a source"
            button={{
              label: t('Index'),
              leftIcon: IconTablerList,
              full: true,
            }}
            size="small"
            options={{
              selected: (dropTableParams?.index?.displayedIndex || 1) - 1,
              list:
                (dropGroup.indexes?.list as MachineDropIndex[]).map(
                  (dropIndex, index) => ({
                    value: String(index),
                    text: dropIndexToString(dropIndex),
                  })
                ) || [],
            }}
            onClose={(value) => {
              value &&
                dropTableParams?.index &&
                (dropTableParams.index = dropGroup.indexes.list[Number(value)])
            }}
          />
        )
      }}
    </Show>
  )
}
