// ---
// JSON
// ---

type JSONBaseProjectVAny = JSONBaseProject

interface JSONBaseProject {
  readonly version: 1
  readonly name: string
  readonly machine: MachineName
  readonly reports: SelectableList<number, JSONMachineReport>
  readonly settings: JSONProjectSettings
  readonly overlays: JSONOverlay[]
  readonly information: JSONField[]
  readonly hardware: JSONField[]
  readonly acquisitionParameters: JSONAcquisitionParameters
}

type MachineName = 'Heavydyn' | 'Maxidyn' | 'Minidyn'

interface JSONProjectSettings {
  readonly version: 1
  arePointsVisible: boolean
  arePointsLinked: boolean
  arePointsLocked: boolean
  areOverlaysVisible: boolean
  pointsState: 'value' | 'number' | 'nothing'
  readonly map: {
    version: 1
    styleIndex: number
    coordinates: LngLat | null
    zoom: number | null
  }
}

interface JSONAcquisitionParameters {
  readonly version: 1
  readonly nbSamples: number
  readonly frequency: number
  readonly preTrig: number
  readonly smoothing?: boolean
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
  readonly overlays: Overlay[]
  readonly acquisitionParameters: JSONAcquisitionParameters
  readonly refreshLinesAndOverlays: () => void
  readonly setMapStyle: (styleIndex: number) => void
  readonly fitOnMap: () => void
  readonly addToMap: () => void
  readonly remove: () => void
  readonly toBaseJSON: () => JSONBaseProject
}
