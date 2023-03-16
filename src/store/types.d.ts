/* eslint-disable no-use-before-define */
interface Store {
  readonly projects: SelectableList<MachineProject>
  selectedProject: MachineProject | null
  selectedReport: MachineReport | null
  map: mapboxgl.Map | null
  updateAvailable: boolean
  importingFile: boolean
}

type StoreKeys = Exclude<keyof Store, 'save' | 'updateAvailable' | 'projects'>

type StoreTypes = Store[keyof Store]

type StoreSaveableTypes = Extract<
  StoreTypes,
  string[] | number[] | boolean[] | string | number | boolean | null
>
