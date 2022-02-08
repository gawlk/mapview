const read = (key: string) => {
  const item = localStorage.getItem(key)

  return typeof item === 'string' ? JSON.parse(item) : null
}

const store = shallowReactive({
  // example: read('example') || defaultExample,
  selectedProject: null,
  projects: shallowReactive([]),
  map: null,
  save: (key: StoreKey, value: StoreSaveableTypes): void => {
    localStorage.setItem(key, JSON.stringify(value))
    // @ts-ignore
    store[key] = value
  },
} as Store)

watch(
  () => store.selectedProject,
  (project, oldProject) => {
    oldProject?.remove()
    project?.addToMap()
  }
)

export default store
