interface Store {
  selectedProject: MachineProject | null
  projects: MachineProject[]
  map: mapboxgl.Map | null
  save: (key: StoreKey, value: StoreSaveableTypes) => void
}

type StoreKey = Exclude<keyof Store, 'save'>

type StoreSaveableTypes = Extract<
  Store[keyof Store],
  string[] | number[] | boolean[] | string | number | boolean | null
>
