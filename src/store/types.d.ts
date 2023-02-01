interface Store {
  readonly projects: SelectableList<MachineProject>
  selectedProject: MachineProject | null
  selectedReport: MachineReport | null
  map: mapboxgl.Map | null
  updateAvailable: boolean
  importingFile: boolean
  readonly save: (key: StoreKeys, value: StoreSaveableTypes) => void
}

type StoreKeys = Exclude<keyof Store, 'save' | 'updateAvailable'>

type StoreTypes = Store[keyof Store]

type StoreSaveableTypes = Extract<
  StoreTypes,
  string[] | number[] | boolean[] | string | number | boolean | null
>
