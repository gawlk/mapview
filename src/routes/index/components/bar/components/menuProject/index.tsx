import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

// import DialogInformations from '/src/components/dialogInformations'
import ButtonSave from './components/buttonSave'
// import DialogConfigurations from './components/dialogConfigurations'
import GroupProjects from './components/groupProjects'

interface Props {
  readonly menu: MenuProps
}

export default (props: Props) => {
  const [t] = useI18n()

  return (
    <>
      <GroupProjects />
      {/* <DialogInformations
    preID="project-"
    data={[
      {
        title: t('Informations'),
        fields: store.projects.selected
          ? [
              store.projects.selected.name,
              ...store.projects.selected.information,
            ]
          : [],
      },
      {
        title: t('Hardware'),
        fields: store.projects.selected ? store.projects.selected.hardware : [],
      },
    ]}
  />
  <DialogConfigurations /> */}
      <ButtonSave />
    </>
  )
}
