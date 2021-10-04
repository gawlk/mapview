interface BaseProject {
  kind: MachineName
  name: string
  readonly database: JSONProjectDatabase
  informations: Field[]
  mapviewSettings: JSONProjectMapviewSettings
  reports: MachineReport[]
  selectedReport: MachineReport | null
  images: Image[]
  units: MathUnit[]
  clean: () => void
}

interface JSONProject {
  name: string
  database: JSONProjectDatabase
  mapviewSettings: JSONProjectMapviewSettings
  images: JSONImage[]
  informations: JSONField[]
  reports: JSONReport[]
}

interface JSONProjectDatabase {
  machine: MachineName
  software: string
  version: number
}

type MachineName = 'heavydyn' | 'maxidyn' | 'minidyn'

interface JSONProjectMapviewSettings {
  coordinates: LngLat
  selectedReport: number
  zoom: number
  arePointsLinked: boolean
  arePointsLocked: boolean
  arePointsVisible: boolean
  areImagesVisible: boolean
  pointsState: PointState
}
