import { ButtonAddProject } from './components/buttonAddProject'
import { ButtonSave } from './components/buttonSave'
import { DialogConfig } from './components/dialogConfig'
import { DialogProjectInformation } from './components/dialogInformation'
import { DialogRemoveProject } from './components/dialogRemoveProject'
import { SelectProject } from './components/selectProjects'

export const MenuProject = () => {
  return (
    <>
      <div class="flex space-x-2">
        <SelectProject />
        <ButtonAddProject />
        <DialogRemoveProject />
      </div>
      <DialogProjectInformation />
      <DialogConfig />
      <ButtonSave />
    </>
  )
}
