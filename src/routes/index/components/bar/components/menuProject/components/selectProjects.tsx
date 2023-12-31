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

  const leftIcon = createMemo(() => {
    const machine = store.selectedProject()?.machine
    return machine ? getMachineIcon(machine) : undefined
  })

  const selected = createMemo(() => {
    const project = store.selectedProject()
    return project ? convertProjectToName(project) : ''
  })

  return (
    <DialogSelect
      title={t('Select a project')}
      attached
      button={{
        class: 'flex-1 min-w-0',
        label: t('Selected'),
        leftIcon: leftIcon(),
        full: true,
      }}
      values={{
        selected: selected(),
        list: store.projects.list().map((project) => ({
          value: convertProjectToName(project),
          leftIcon: getMachineIcon(project.machine),
          rightIcon:
            project === store.selectedProject()
              ? IconTablerZoomIn
              : IconTablerArrowNarrowRight,
        })),
      }}
      onClose={(value) => {
        if (value) {
          const project = store.projects
            .list()
            .find((_project) => convertProjectToName(_project) === value)

          if (project) {
            if (store.selectedProject() === project) {
              project.fitOnMap()
            } else {
              store.selectProject(project)
            }
          }
        }
      }}
    />
  )
}
