import { useI18n } from '@solid-primitives/i18n'
import { log } from 'console'

import store from '/src/store'

import { DialogInformation } from '/src/components'

export default () => {
  const [t] = useI18n()

  const bulks = createMemo(() => [
    {
      title: t('Informations'),
      fields: store.selectedReport
        ? [store.selectedReport.name, ...store.selectedReport.information]
        : [],
    },
    {
      title: t('Hardware'),
      fields: store.selectedReport ? store.selectedReport.platform : [],
    },
  ])

  // TODO: Comboboxes input (dataList) via https://floating-ui.com

  return <DialogInformation bulks={bulks()} />
}
