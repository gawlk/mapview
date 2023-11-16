import { createASS, createSL } from '/src/scripts'

const projects = createSL<MachineProject>([])
const selectedProject = createMemo(() => projects.selected())

export const store: Store = {
  projects,
  selectedProject,
  selectedReport: createMemo(
    () => selectedProject()?.reports?.selected() || null,
  ),
  selectProject(project) {
    const currentProject = this.projects.selected()

    if (
      project &&
      currentProject !== project &&
      this.projects.list().includes(project)
    ) {
      currentProject?.removeFromMap()
      store.projects.select(project)
      store.projects.selected()?.addToMap()
      return project
    }
    return null
  },
  pushAndSelectProject(project) {
    const currentProject = this.projects.selected()

    if (
      project &&
      currentProject !== project &&
      !this.projects.list().includes(project)
    ) {
      currentProject?.removeFromMap()
      store.projects.pushAndSelect(project)
      project.addToMap()
      return project
    }
    return null
  },
  selectReport(report) {
    if (report && this.selectedProject) {
      // @ts-expect-error type issue
      this.selectedProject()?.reports.select(report)
      return report
    }
    return null
  },
  updateAvailable: createASS(false),
  importingFile: createASS(false),
  map: createASS(null),
}
