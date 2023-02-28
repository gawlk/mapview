import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { downloadFile, mpvzExporter } from '/src/scripts'

import { Button } from '/src/components'

export default () => {
  const [t] = useI18n()

  const save = async () =>
    store.projects.selected &&
    downloadFile(await mpvzExporter.export(store.projects.selected))

  return (
    <Button
      full
      leftIcon={IconTablerFileDownload}
      disabled={!store.projects.selected}
      onClick={save}
    >
      {t('Save project')}
    </Button>
  )
}
