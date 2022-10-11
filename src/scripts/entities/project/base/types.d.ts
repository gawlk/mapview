// ---
// JSON
// ---

type JSONBaseProjectVAny = JSONBaseProject

interface JSONBaseProject {
  version: 1
  name: string
  machine: MachineName
  reports: SelectableList<number, JSONMachineReport>
  settings: JSONProjectSettings
  images: JSONImage[]
  information: JSONField[]
  hardware: JSONField[]
}

type MachineName = 'Heavydyn' | 'Maxidyn' | 'Minidyn'

interface JSONProjectSettings {
  version: 1
  arePointsVisible: boolean
  arePointsLinked: boolean
  arePointsLocked: boolean
  areImagesVisible: boolean
  pointsState: 'value' | 'number' | 'nothing'
  map: {
    version: 1
    styleIndex: number
    coordinates?: LngLat
    zoom?: number
  }
}

// ---
// Object
// ---

interface BaseProject {
  readonly machine: MachineName
  readonly name: Field
  readonly information: Field[]
  readonly hardware: Field[]
  readonly reports: SelectableList<MachineReport>
  readonly units: MachineMathUnits
  readonly settings: JSONProjectSettings
  readonly images: Image[]
  refreshLinesAndImages: () => void
  setMapStyle: (styleIndex: number) => void
  fitOnMap: () => void
  addToMap: () => void
  remove: () => void
  toBaseJSON: () => JSONBaseProject
}
