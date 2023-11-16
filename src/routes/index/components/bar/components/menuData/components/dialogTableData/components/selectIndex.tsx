import { DialogSelect, SpanDropIndex } from '/src/components'
import { useAppState } from '/src/index'
import { run } from '/src/scripts'
import { store } from '/src/store'

export const SelectIndex = () => {
  const { t } = useAppState()

  const selectedTableParams = createMemo(
    () => store.selectedReport()?.dataLabels.table.selected(),
  )

  return (
    <Show when={selectedTableParams()?.group.from === 'Drop'}>
      {run(() => {
        const dropTableParams = selectedTableParams()
        const dropGroup = dropTableParams?.group as BaseDropDataLabelsGroup<
          string,
          BaseDropIndex
        >

        return (
          <DialogSelect
            title={t('Select a source')}
            button={{
              label: t('Index'),
              leftIcon: IconTablerListNumbers,
              full: true,
            }}
            attached
            values={{
              selected: (dropTableParams?.index?.().displayedIndex || 1) - 1,
              list:
                (dropGroup.indexes?.list() as MachineDropIndex[]).map(
                  (dropIndex, index) => ({
                    value: String(index),
                    text: () => <SpanDropIndex dropIndex={dropIndex} />,
                  }),
                ) || [],
            }}
            onClose={(value) => {
              const index = dropTableParams?.index

              value &&
                index &&
                index.set(dropGroup.indexes.list()[Number(value)])
            }}
          />
        )
      })}
    </Show>
  )
}
