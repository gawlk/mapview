interface BaseProject {
  readonly machine: MachineName
  name: MachineField
  informations: MachineField[]
  mapviewSettings: JSONProjectMapviewSettings
  reports: MachineReport[]
  selectedReport: MachineReport | null
  images: Image[]
  units: MathUnit[]
  refreshLinesAndImages: () => void
  setMapStyle: (styleIndex: number) => void
  fitOnMap: () => void
  addToMap: () => void
  remove: () => void
}

interface JSONProject {
  name: string
  machine: MachineName
  selectedReport?: number
  mapviewSettings: JSONProjectMapviewSettings
  images: JSONImage[]
  informations: JSONField[]
  reports: JSONReport[]
  units: JSONUnits
}

type MachineName = 'heavydyn' | 'maxidyn' | 'minidyn'

interface JSONProjectMapviewSettings {
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
