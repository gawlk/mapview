import { DialogInformation } from '/src/components'
import { useAppState } from '/src/index'
import { store } from '/src/store'

export const DialogProjectInformation = () => {
  const { t } = useAppState()

  const bulks = createMemo(() => {
    const selectedProject = store.selectedProject()
    return [
      {
        title: t('Information'),
        fields: selectedProject
          ? [selectedProject.name, ...selectedProject.information]
          : [],
      },
      {
        title: t('Hardware'),
        fields: selectedProject?.hardware || [],
      },
    ]
  })

  return <DialogInformation bulks={bulks()} />
}
