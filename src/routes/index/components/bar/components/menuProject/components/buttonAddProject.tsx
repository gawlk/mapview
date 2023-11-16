import { ButtonFile } from '/src/components'
import { importFile } from '/src/scripts'
import { store } from '/src/store'

export const ButtonAddProject = () => {
  const addProject = async (file: File | undefined) => {
    if (file) {
      store.importingFile.set(true)

      const project = await importFile(file)

      store.importingFile.set(false)

      if (project) {
        store.pushAndSelectProject(project)
      }
    }
  }

  return <ButtonFile onFiles={(files) => addProject(files?.[0])} />
}
