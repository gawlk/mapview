import { shallowReactive } from 'vue'

import { mapStyles } from '/src/scripts'

const store: Store = shallowReactive({
  // example: localStorage.getItem('example') || defaultExample,
  project: undefined,
  map: undefined,
  mapStyle: localStorage.getItem('mapStyle') || mapStyles[0],
  save: (key: string, value: string): void => {
    localStorage.setItem(key, value)
    store[key] = value
  },
})

export default store
