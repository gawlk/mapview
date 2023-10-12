import { DialogSelect, SpanDropIndex } from '/src/components'
import { useAppState } from '/src/index'
import { run } from '/src/scripts'
import { store } from '/src/store'

export const SelectIndex = () => {
  const { t } = useAppState()

  const selectedDataLabelGroup = createMemo(
    () => store.selectedReport?.dataLabels.groups.selected,
  )

  return (
    <Show when={selectedDataLabelGroup()?.from === 'Drop'}>
      {run(() => {
        const dropGroup =
          selectedDataLabelGroup() as BaseDropDataLabelsGroup<BaseDropIndex>

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
              selected: (dropGroup.indexes.selected?.displayedIndex || 1) - 1,
              list:
                (dropGroup.indexes?.list as MachineDropIndex[]).map(
                  (dropIndex, index) => ({
                    value: String(index),
                    text: () => <SpanDropIndex dropIndex={dropIndex} />,
                  }),
                ) || [],
            }}
            onClose={(value) => {
              value && dropGroup.indexes.selectIndex(Number(value))
            }}
          />
        )
      })}
    </Show>
  )
}
