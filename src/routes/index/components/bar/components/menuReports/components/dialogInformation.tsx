import { useI18n } from '@solid-primitives/i18n'

import { store } from '/src/store'

import { DialogInformation } from '/src/components'

export const DialogReportInformation = () => {
  const [t] = useI18n()

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
