interface BaseProject {
  readonly machine: MachineName
  readonly name: MachineField
  readonly informations: MachineField[]
  readonly reports: SelectableList<MachineReport>
  units: MachineUnits
  settings: JSONProjectSettings
  images: Image[]
  refreshLinesAndImages: () => void
  setMapStyle: (styleIndex: number) => void
  fitOnMap: () => void
  addToMap: () => void
  remove: () => void
}

interface BaseProjectCreatorParameters {
  machine: MachineName
  units: MachineUnits
}

interface JSONProject {
  name: string
  machine: MachineName
  selectedReport?: number
  settings: JSONProjectSettings
  images: JSONImage[]
  informations: JSONField[]
  reports: JSONReport[]
  units: JSONUnits
}

type MachineName = 'heavydyn' | 'maxidyn' | 'minidyn'

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
