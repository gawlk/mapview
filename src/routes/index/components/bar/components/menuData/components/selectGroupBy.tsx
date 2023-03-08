import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { DialogSelect } from '/src/components'

export default () => {
  const [t] = useI18n()

  const groupBys = ['Number', 'Zone'] as ReportGroupBy[]

  return (
    <DialogSelect
      title="Select a group by"
      button={{
        label: t('Group by'),
        leftIcon: IconTablerList,
        full: true,
      }}
      size="small"
      list={{
        selected: t(store.selectedReport?.settings.groupBy || ''),
        values: groupBys.map((s) => ({
          value: s,
          label: t(s),
        })),
      }}
      onClose={(value) => {
        value &&
          store.selectedReport &&
          (groupBys as string[]).includes(value) &&
          (store.selectedReport.settings.groupBy = value as ReportGroupBy)
      }}
    />
  )
}
