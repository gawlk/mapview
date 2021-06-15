import { shallowReactive } from 'vue'

const store: Store = shallowReactive({
  // example: localStorage.getItem('example') || defaultExample,
  project: undefined,
  selectedReport: undefined,
  map: undefined,
  save: (key: string, value: string): void => {
    localStorage.setItem(key, value)
    store[key] = value
  },
})

export default store
