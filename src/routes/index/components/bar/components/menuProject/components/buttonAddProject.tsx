import store from '/src/store'

import { acceptedExtensions, importFile } from '/src/scripts'

import { Button, ButtonFile } from '/src/components'

export default () => {
  let inputFile: HTMLInputElement | undefined

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
