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
      options={{
        selected: store.selectedProject
          ? convertProjectToName(store.selectedProject)
          : '',
        list: store.projects.list.map((project) => ({
          value: convertProjectToName(project),
          leftIcon:
            project === store.selectedProject
              ? IconTablerFocusCentered
              : IconTablerPlaneDeparture,
        })),
      }}
      onClose={(value) => {
        if (value) {
          const project = store.projects.list.find(
            (project) => convertProjectToName(project) === value
          )

          if (project) {
            if (store.projects.selected === project) {
              project.fitOnMap()
            } else {
              store.projects.selected = project
            }
          }
        }
      }}
    />
  )
}
