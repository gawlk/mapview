import { createSelectableList } from '/src/scripts/utils/selectableList'

const store = createMutable<Store>({
  // example: read('example') || defaultExample,
  projects: createSelectableList([]),
  get selectedProject() {
    return this.projects.selected
  },
  set selectedProject(project: MachineProject | null) {
    const oldProject = this.projects.selected

    if (oldProject !== project) {
      oldProject?.remove()
      this.projects.select(project)
      this.projects.selected?.addToMap()
    }
  },
  get selectedReport() {
    return this.selectedProject?.reports?.selected || null
  },
  set selectedReport(report: MachineReport | null) {
    if (this.selectedProject) {
      this.selectedProject.reports.select<BaseReport>(report)
    }
  },
  dialogEntity: null,
  updateAvailable: false,
  importingFile: false,
  map: null,
  save: (key: StoreKeys, value: StoreSaveableTypes): void => {
    localStorage.setItem(key, JSON.stringify(value))
    // @ts-ignore
    store[key] = value
  },
})

export default store
