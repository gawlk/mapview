import { createSelectableList } from '/src/scripts/utils/selectableList'

const store: Store = shallowReactive({
  // example: read('example') || defaultExample,
  projects: createSelectableList([]),
  selectedProject: null,
  selectedReport: null,
  updateAvailable: false,
  importingFile: false,
  map: null,
})

watch(
  () => store.projects.selected,
  (project, oldProject) => {
    store.selectedProject = project

    oldProject?.remove()
    project?.addToMap()
  }
)

watch(
  () => store.projects.selected?.reports.selected,
  (report) => {
    store.selectedReport = report || null
  }
)

export default store
