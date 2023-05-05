import { useI18n } from '@solid-primitives/i18n'

import { Dialog } from '/src/components'

export default () => {
  const [t] = useI18n()

  return (
    <Dialog
      button={{
        leftIcon: IconTablerCloudDownload,
        full: true,
        color: 'orange',
      }}
      title={t('Export report')}
    ></Dialog>
  )
}
