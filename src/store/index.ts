import { createSelectableList } from '/src/scripts/utils/selectableList'

console.log('context', import.meta.env.VITE_CONTEXT)

const store: Store = shallowReactive({
  projects: createSelectableList([]),
  selectedProject: null,
  selectedReport: null,
  updateAvailable: false,
  importingFile: false,
  map: null,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.VITE_CONTEXT === 'production',
  context: import.meta.env.VITE_CONTEXT,
  save: (key: StoreKeys, value: StoreSaveableTypes): void => {
    localStorage.setItem(key, JSON.stringify(value))
    // @ts-ignore
    store[key] = value
  },
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
    // @ts-ignore
    store.selectedReport = report
  }
)

export default store
