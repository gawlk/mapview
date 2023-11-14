import { DialogInformation } from '/src/components'
import { useAppState } from '/src/index'
import { store } from '/src/store'

export const DialogReportInformation = () => {
  const { t } = useAppState()

  const bulks = createMemo(() => {
    const selectedReport = store.selectedReport()
    return [
      {
        title: t('Information'),
        fields: selectedReport
          ? [selectedReport.name, ...selectedReport.information]
          : [],
      },
      {
        title: t('Platform'),
        fields: selectedReport?.platform || [],
      },
    ]
  })

  return <DialogInformation bulks={bulks()} />
}
