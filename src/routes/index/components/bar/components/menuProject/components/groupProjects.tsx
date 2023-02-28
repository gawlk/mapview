import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { acceptedExtensions, importFile } from '/src/scripts'

import { Button, Dialog, DialogSelect } from '/src/components'

export default () => {
  const [t] = useI18n()

  let inputFile: HTMLInputElement | undefined

  const state = createMutable({
    isOpen: false,
  })

  const selectProject = (index: number) => {
    const project = store.projects.list[index]
    if (store.projects.selected === project) {
      project.fitOnMap()
    } else {
      store.projects.selected = project
    }
  }

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

  const deleteProject = () => {
    state.isOpen = false

    const index = store.projects.list.findIndex(
      (project) => project === store.projects.selected
    )

    const project = store.projects.list.splice(index, 1)?.[0]

    if (project === store.projects.selected) {
      store.projects.selected =
        store.projects.list.length - 1 >= index
          ? store.projects.list[index]
          : store.projects.list.slice(-1).pop() || null
    }
  }

  const convertProjectToName = (project: MachineProject) =>
    `${project.name.value} - ${project.machine}`

  return (
    <>
      <div class="flex space-x-2">
        <DialogSelect
          title="Select a project"
          button={{
            label: t('Selected'),
            leftIcon: IconTablerList,
            full: true,
            text: store.selectedProject
              ? convertProjectToName(store.selectedProject)
              : '',
          }}
          list={{
            selected: store.selectedProject
              ? convertProjectToName(store.selectedProject)
              : '',
            values: store.projects.list.map((project, index) => ({
              value: String(index),
              label: convertProjectToName(project),
              icon: IconTablerZoomIn,
            })),
          }}
          onClose={(value) =>
            (store.projects.selected = store.projects.list[Number(value)])
          }
        />
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
        <Show when={store.projects.list.length > 1}>
          <Dialog
            title={t('Delete project')}
            button={{
              icon: IconTablerTrash,
              color: 'red',
            }}
          >
            <Button>I'm sure</Button>
          </Dialog>
        </Show>
      </div>
      <Button
        class="sm:hidden"
        onClick={() => inputFile?.click()}
        leftIcon={IconTablerArchive}
        rightIcon={IconTablerPlus}
        full
      >
        {t('Add a project')}
      </Button>
    </>
  )
}
