import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { DialogSelect } from '/src/components'

const getMachineIcon = (machine: MachineName) =>
  machine === 'Heavydyn'
    ? IconTablerCaravan
    : machine === 'Maxidyn'
    ? IconTablerCarCrane
    : IconTablerChess

export default () => {
  const [t] = useI18n()

  const convertProjectToName = (project: MachineProject) =>
    `${project.name.value}`
  // `${project.name.value} - ${project.machine}`

  return (
    <DialogSelect
      title="Select a project"
      attached
      button={{
        class: 'flex-1 min-w-0',
        label: t('Selected'),
        leftIcon: store.selectedProject
          ? getMachineIcon(store.selectedProject.machine)
          : undefined,
        full: true,
        text: store.selectedProject
          ? convertProjectToName(store.selectedProject)
          : '',
      }}
      values={{
        selected: store.selectedProject
          ? convertProjectToName(store.selectedProject)
          : '',
        list: store.projects.list.map((project) => ({
          value: convertProjectToName(project),
          leftIcon: getMachineIcon(project.machine),
          rightIcon:
            project === store.selectedProject
              ? IconTablerZoomIn
              : IconTablerArrowNarrowRight,
        })),
      }}
      onClose={(value) => {
        if (value) {
          const project = store.projects.list.find(
            (project) => convertProjectToName(project) === value
          )

          if (project) {
            if (store.selectedProject === project) {
              project.fitOnMap()
            } else {
              store.selectedProject = project
            }
          }
        }
      }}
    />
  )
}
