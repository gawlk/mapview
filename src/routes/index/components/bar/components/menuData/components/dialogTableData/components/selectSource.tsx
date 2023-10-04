import { DialogSelect } from '/src/components'
import { useAppState } from '/src/index'
import { store } from '/src/store'

export const SelectSource = () => {
  const { t } = useAppState()

  const tableDataLabels = createMemo(
    () => store.selectedReport?.dataLabels.table,
  )

  return (
    <DialogSelect
      title="Select a source"
      attached
      button={{
        label: t('Source'),
        full: true,
      }}
      values={{
        selected: tableDataLabels()?.selectedIndex ?? null,
        list:
          tableDataLabels()
            ?.list.filter((parameters) => parameters.group.choices.list.length)
            .map((parameters, index) => ({
              value: String(index),
              text: t(parameters.group.from),
            })) || [],
      }}
      onClose={(value) =>
        value && tableDataLabels()?.selectIndex(Number(value))
      }
    />
  )
}
