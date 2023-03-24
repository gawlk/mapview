import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { DialogSelect } from '/src/components'

export default () => {
  const [t] = useI18n()

  const tableDataLabels = createMemo(
    () => store.selectedReport?.dataLabels.table
  )

  return (
    <DialogSelect
      title="Select a source"
      position="relative"
      button={{
        label: t('Source'),
        leftIcon: IconTablerList,
        full: true,
      }}
      options={{
        selected: tableDataLabels()?.selected?.group.from || '',
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
