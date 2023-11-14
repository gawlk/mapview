interface Store {
  readonly projects: SelectableList<MachineProject>
  readonly selectedProject: Accessor<MachineProject | null>
  readonly selectedReport: Accessor<MachineReport | null>
  readonly selectProject: (
    project: MachineProject | null,
  ) => MachineProject | null
  readonly pushAndSelectProject: (
    project: MachineProject | null,
  ) => MachineProject | null
  readonly selectReport: (project: BaseReport | null) => BaseReport | null
  readonly map: ASS<mapboxgl.Map | null>
  readonly updateAvailable: ASS<boolean>
  readonly importingFile: ASS<boolean>
}

type StoreKeys = Exclude<keyof Store, 'save' | 'updateAvailable' | 'projects'>

type StoreTypes = Store[keyof Store]

type StoreSaveableTypes = Extract<
  StoreTypes,
  string[] | number[] | boolean[] | string | number | boolean | null
>
