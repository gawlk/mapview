import { DialogInformation } from '/src/components'
import { useAppState } from '/src/index'
import { store } from '/src/store'

export const DialogProjectInformation = () => {
  const { t } = useAppState()

  const bulks = createMemo(() => [
    {
      title: t('Information'),
      fields: store.selectedProject
        ? [store.selectedProject.name, ...store.selectedProject.information]
        : [],
    },
    {
      title: t('Hardware'),
      fields: store.selectedProject ? store.selectedProject.hardware : [],
    },
  ])

  return <DialogInformation bulks={bulks()} />
}
