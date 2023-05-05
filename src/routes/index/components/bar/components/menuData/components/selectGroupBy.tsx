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
        full: true,
      }}
      position="relative"
      options={{
        selected: t(store.selectedReport?.settings.groupBy || ''),
        list: groupBys.map((s) => ({
          value: s,
          text: t(s),
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
