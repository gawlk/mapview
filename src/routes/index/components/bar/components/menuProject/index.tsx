import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import ButtonAddProject from './components/buttonAddProject'
// import DialogInformations from '/src/components/dialogInformations'
import ButtonSave from './components/buttonSave'
import DialogInformations from './components/dialogInformations'
import DialogRemoveProject from './components/dialogRemoveProject'
// import DialogConfigurations from './components/dialogConfigurations'
import SelectProjects from './components/selectProjects'

interface Props {
  readonly menu: MenuProps
}

export default (props: Props) => {
  const [t] = useI18n()

  return (
    <>
      <div class="flex space-x-2">
        <SelectProjects />
        <ButtonAddProject />
        <DialogRemoveProject />
        {/* <GroupProjects /> */}
      </div>
      <DialogInformations />
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
