import { store } from '/src/store'

import { importFile } from '/src/scripts'

import { ButtonFile } from '/src/components'

export const ButtonAddProject = () => {
  const addProject = async (file: File | undefined) => {
    if (file) {
      store.importingFile = true

      const project = await importFile(file)

      store.importingFile = false

      if (project) {
        store.selectedProject = project
      }
    }
  }

  return (
    <ButtonFile
      onFiles={(files) => {
        addProject(files?.[0])
      }}
    />
  )
}
