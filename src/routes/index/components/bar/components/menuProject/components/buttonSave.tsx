import { useI18n } from '@solid-primitives/i18n'

import { Button } from '/src/components'
import { downloadFile, mpvzExporter } from '/src/scripts'
import { store } from '/src/store'

export const ButtonSave = () => {
  const [t] = useI18n()

  const save = async () =>
    store.selectedProject &&
    downloadFile(await mpvzExporter.export(store.selectedProject))

  return (
    <Button
      full
      leftIcon={IconTablerFileDownload}
      disabled={!store.selectedProject}
      onClick={() => {
        void save()
      }}
      color="orange"
    >
      {t('Save project')}
    </Button>
  )
}
