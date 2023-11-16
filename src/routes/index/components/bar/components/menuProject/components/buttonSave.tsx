import { Button } from '/src/components'
import { useAppState } from '/src/index'
import { downloadFile, mpvzExporter } from '/src/scripts'
import { store } from '/src/store'

export const ButtonSave = () => {
  const { t } = useAppState()

  const save = async () => {
    const selectedProject = store.selectedProject()
    selectedProject && downloadFile(await mpvzExporter.export(selectedProject))
  }

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
