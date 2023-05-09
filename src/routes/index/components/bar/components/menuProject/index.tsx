import { useI18n } from '@solid-primitives/i18n'

import ButtonAddProject from './components/buttonAddProject'
import ButtonSave from './components/buttonSave'
// import DialogConfigurations from './components/dialogConfigurations'
import DialogConfigurations from './components/dialogConfig'
import DialogInformations from './components/dialogInformations'
import DialogRemoveProject from './components/dialogRemoveProject'
import SelectProjects from './components/selectProjects'

export default () => {
  const [t] = useI18n()

  return (
    <>
      <div class="flex space-x-2">
        <SelectProjects />
        <ButtonAddProject />
        <DialogRemoveProject />
      </div>
      <DialogInformations />
      <DialogConfigurations />
      <ButtonSave />
    </>
  )
}
