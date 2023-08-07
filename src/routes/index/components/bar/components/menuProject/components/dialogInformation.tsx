import { useI18n } from '@solid-primitives/i18n'

import { store } from '/src/store'

import { DialogInformation } from '/src/components'

export const DialogProjectInformation = () => {
  const [t] = useI18n()

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
