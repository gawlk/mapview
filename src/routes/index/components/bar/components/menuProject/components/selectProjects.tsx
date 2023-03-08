import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { DialogSelect } from '/src/components'

export default () => {
  const [t] = useI18n()

  const convertProjectToName = (project: MachineProject) =>
    `${project.name.value} - ${project.machine}`

  return (
    <DialogSelect
      title="Select a project"
      size="small"
      button={{
        class: 'flex-1 min-w-0',
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
      onClose={(value) => {
        if (value) {
          const index = Number(value)

          const project = store.projects.list[index]
          if (store.projects.selected === project) {
            project.fitOnMap()
          } else {
            store.projects.selected = project
          }
        }
      }}
    />
  )
}
