import { DialogSelect } from '/src/components'
import { env } from '/src/env'
import { useAppState } from '/src/index'
import { hasRawData } from '/src/scripts'
import { store } from '/src/store'

const getMachineIcon = (machine: MachineName) => {
  if (machine === 'Heavydyn') {
    return IconTablerCaravan
  }

  if (machine === 'Maxidyn') {
    return IconTablerCarCrane
  }

  return IconTablerChess
}

export const SelectProject = () => {
  const { t } = useAppState()

  const convertProjectToName = (project: MachineProject) =>
    env.isDev && hasRawData(project)
      ? `${project.name.toString()} - Raw data`
      : `${project.name.toString()}`

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
            (_project) => convertProjectToName(_project) === value,
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
