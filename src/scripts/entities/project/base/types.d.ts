interface BaseProject {
  readonly machine: MachineName
  readonly name: MachineField
  readonly informations: MachineField[]
  readonly hardware: MachineField[]
  readonly reports: SelectableList<MachineReport>
  readonly units: MachineMathUnits
  readonly settings: JSONProjectSettings
  readonly images: Image[]
  readonly channels: JSONChannel[]
  refreshLinesAndImages: () => void
  setMapStyle: (styleIndex: number) => void
  fitOnMap: () => void
  addToMap: () => void
  remove: () => void
}

interface BaseProjectCreatorParameters {
  machine: MachineName
  units: MachineMathUnits
}

interface JSONProject {
  name: string
  machine: MachineName
  selectedReport?: number
  settings: JSONProjectSettings
  images: JSONImage[]
  informations: JSONField[]
  hardware: JSONField[]
  reports: JSONReport[]
  units: JSONMachineUnits
  channels: JSONChannel[]
}

type MachineName = 'Heavydyn' | 'Maxidyn' | 'Minidyn'

interface JSONProjectSettings {
  arePointsVisible: boolean
  arePointsLinked: boolean
  arePointsLocked: boolean
  areImagesVisible: boolean
  pointsState: PointsState
  map: {
    styleIndex: number
    coordinates?: LngLat
    zoom?: number
  }
}

type PointsState = 'value' | 'number' | 'nothing'

interface MathUnitWithThresholds {
  unit: MathUnit
  thresholds: AnyThreshold[]
}

interface JSONChannel {
  name: string
  position: string
  gain: number
  acquisition: number
}
