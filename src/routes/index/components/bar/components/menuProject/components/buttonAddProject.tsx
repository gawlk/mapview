import store from '/src/store'

import { acceptedExtensions, importFile } from '/src/scripts'

import { Button } from '/src/components'

export default () => {
  let inputFile: HTMLInputElement | undefined

  const addProject = async (file: File | undefined) => {
    if (file) {
      store.importingFile = true

      const project = await importFile(file)

      store.importingFile = false

      if (project) {
        store.projects.selected = project
      }
    }
  }

  return (
    <>
      <Button
        class="hidden sm:block"
        onClick={() => inputFile?.click()}
        icon={IconTablerPlus}
      />
      <input
        class="hidden"
        onChange={(event) =>
          addProject((event.target as HTMLInputElement).files?.[0])
        }
        accept={acceptedExtensions.join(', ')}
        type="file"
        ref={inputFile}
      />
    </>
  )
}
