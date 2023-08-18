import { useI18n } from '@solid-primitives/i18n'

import { DialogSelect } from '/src/components'
import { store } from '/src/store'

export const SelectSource = () => {
  const [t] = useI18n()

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
