import { DialogInformation } from '/src/components'
import { useAppState } from '/src/index'
import { store } from '/src/store'

export const DialogReportInformation = () => {
  const { t } = useAppState()

  const bulks = createMemo(() => [
    {
      title: t('Information'),
      fields: store.selectedReport
        ? [store.selectedReport.name, ...store.selectedReport.information]
        : [],
    },
    {
      title: t('Hardware'),
      fields: store.selectedReport ? store.selectedReport.platform : [],
    },
  ])

  return <DialogInformation bulks={bulks()} />
}
