import { DialogSelect } from '/src/components'
import { useAppState } from '/src/index'
import { store } from '/src/store'

export const SelectGroupBy = () => {
  const { t } = useAppState()

  const groupBys = ['Number', 'Zone'] as ReportGroupBy[]

  return (
    <DialogSelect
      title={t('Select a group by')}
      button={{
        label: t('Group by'),
        full: true,
      }}
      attached
      values={{
        selected: t(store.selectedReport()?.settings.groupBy() || ''),
        list: groupBys.map((s) => ({
          value: s,
          text: t(s),
        })),
      }}
      onClose={(value) => {
        value &&
          (groupBys as string[]).includes(value) &&
          store.selectedReport()?.settings.groupBy.set(value as ReportGroupBy)
      }}
    />
  )
}
