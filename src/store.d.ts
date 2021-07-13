type Store = {
  [key: string]: any
  project: Project | undefined
  map: mapboxgl.Map | undefined
  save: (key: string, value: string) => void
}
