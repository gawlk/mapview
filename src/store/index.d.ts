interface Store {
  [key: string]: any
  project: MachineProject | undefined
  map: mapboxgl.Map | undefined
  mapStyle: string
  save: (key: string, value: string) => void
}
