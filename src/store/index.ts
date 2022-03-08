import { createSelectableList } from '/src/scripts'

const read = (key: string) => {
  const item = localStorage.getItem(key)

  return typeof item === 'string' ? JSON.parse(item) : null
}

const store = shallowReactive({
  // example: read('example') || defaultExample,
  projects: createSelectableList<MachineProject>(null, [], {
    reactive: true,
  }),
  map: null,
  save: (key: StoreKey, value: StoreSaveableTypes): void => {
    localStorage.setItem(key, JSON.stringify(value))
    // @ts-ignore
    store[key] = value
  },
} as Store)

watch(
  () => store.projects.selected,
  (project, oldProject) => {
    oldProject?.remove()
    project?.addToMap()
  }
)

export default store
