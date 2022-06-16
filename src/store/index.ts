import { createSelectableList } from '/src/scripts/utils/selectableList'

const store: Store = shallowReactive({
  // example: read('example') || defaultExample,
  updateAvailable: false,
  projects: createSelectableList(null, [], {
    reactive: true,
  }),
  map: null,
  save: (key: StoreKeys, value: StoreSaveableTypes): void => {
    localStorage.setItem(key, JSON.stringify(value))
    // @ts-ignore
    store[key] = value
  },
})

watch(
  () => store.projects.selected,
  (project, oldProject) => {
    oldProject?.remove()
    project?.addToMap()
  }
)

export default store
