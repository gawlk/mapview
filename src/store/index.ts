import { createSelectableList } from '/src/scripts/utils/selectableList'

const store: Store = createMutable({
  // example: read('example') || defaultExample,
  projects: createSelectableList([]),
  selectedProject: null,
  selectedReport: null,
  updateAvailable: false,
  importingFile: false,
  map: null,
  save: (key: StoreKeys, value: StoreSaveableTypes): void => {
    localStorage.setItem(key, JSON.stringify(value))
    // @ts-ignore
    store[key] = value
  },
  init: () => {
    createEffect(
      on(
        () => store.projects.selected,
        (project, oldProject) => {
          store.selectedProject = project

          oldProject?.remove()
          project?.addToMap()
        }
      )
    )

    createEffect(
      on(
        () => store.projects.selected?.reports.selected,
        (report) => {
          // @ts-ignore
          store.selectedReport = report
        }
      )
    )
  },
})

export default store
