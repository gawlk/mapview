interface Store {
  projects: SelectableList<MachineProject>
  map: mapboxgl.Map | null
  save: (key: StoreKeys, value: StoreSaveableTypes) => void
}

type StoreKeys = Exclude<keyof Store, 'save'>

type StoreTypes = Store[keyof Store]

type StoreSaveableTypes = Extract<
  StoreTypes,
  string[] | number[] | boolean[] | string | number | boolean | null
>
