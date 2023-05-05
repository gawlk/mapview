import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { downloadFile, mpvzExporter } from '/src/scripts'

import { Button } from '/src/components'

export default () => {
  const [t] = useI18n()

  const save = async () =>
    store.selectedProject &&
    downloadFile(await mpvzExporter.export(store.selectedProject))

  return (
    <Button
      full
      leftIcon={IconTablerFileDownload}
      disabled={!store.selectedProject}
      onClick={save}
      color="orange"
    >
      {t('Save project')}
    </Button>
  )
}
