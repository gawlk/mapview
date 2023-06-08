import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { DialogSelect, SpanDropIndex } from '/src/components'

export default () => {
  const [t] = useI18n()

  const selectedTableParams = createMemo(
    () => store.selectedReport?.dataLabels.table.selected
  )

  return (
    <Show when={selectedTableParams()?.group.from === 'Drop'}>
      {(() => {
        const dropTableParams = selectedTableParams()
        const dropGroup =
          dropTableParams?.group as BaseDropDataLabelsGroup<BaseDropIndex>

        return (
          <DialogSelect
            title="Select a source"
            button={{
              label: t('Index'),
              leftIcon: IconTablerListNumbers,
              full: true,
            }}
            position="absolute"
            values={{
              selected: (dropTableParams?.index?.displayedIndex || 1) - 1,
              list:
                (dropGroup.indexes?.list as MachineDropIndex[]).map(
                  (dropIndex, index) => ({
                    value: String(index),
                    text: () => <SpanDropIndex dropIndex={dropIndex} />,
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
      })()}
    </Show>
  )
}
