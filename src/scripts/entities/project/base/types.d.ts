// ---
// JSON
// ---

type JSONBaseProjectVAny = JSONBaseProject

interface JSONBaseProject {
  readonly version: 1
  readonly name: string
  readonly reports: JSONSelectableList<JSONMachineReport>
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
  // arePointsLocked: boolean
  areOverlaysVisible: boolean
  pointsState: 'value' | 'number' | 'nothing'
  readonly map: {
    version: 1
    styleIndex: number
    coordinates?: LngLat
    zoom?: number
    pitch?: number
    rotation?: number
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

interface BaseProject<
  Report extends BaseReport = MachineReport,
  MathUnits extends MachineMathUnits = MachineMathUnits
> extends BaseObject<JSONBaseProject>,
    Entity<'Project'> {
  state: 'Loading' | 'Loaded'
  readonly name: Field
  readonly information: Field[]
  readonly hardware: Field[]
  readonly reports: SelectableList<Report>
  readonly units: MathUnits
  readonly settings: BaseProjectSettings
  readonly overlays: Overlay[]
  readonly acquisitionParameters: JSONAcquisitionParameters
  readonly refreshLinesAndOverlays: () => void
  readonly setMapStyle: (styleIndex: number) => void
  readonly fitOnMap: () => void
  readonly addToMap: () => void
  readonly remove: () => void
}

interface BaseProjectSettings extends JSONProjectSettings {
  arePointsLocked: boolean
}
