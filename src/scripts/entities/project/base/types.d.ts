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
  readonly arePointsVisible: boolean
  readonly arePointsLinked: boolean
  readonly areOverlaysVisible: boolean
  readonly pointsState: 'value' | 'number' | 'nothing'
  readonly map: JSONProjectMapSettings
}

interface JSONProjectMapSettings {
  readonly version: 1
  readonly styleIndex: MapStyleIndex
  readonly coordinates?: LngLat
  readonly zoom?: number
  readonly pitch?: number
  readonly rotation?: number
}

type MapStyleIndex = 0 | 1 | 2 | 3 | 4

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
  MathUnits extends MachineMathUnits = MachineMathUnits,
> extends BaseObject<JSONBaseProject>,
    Entity<'Project'>,
    OnMapObject {
  readonly state: ASS<'Loading' | 'Loaded'>
  readonly name: Field
  readonly information: Field[]
  readonly hardware: Field[]
  readonly reports: SelectableList<Report>
  readonly units: MathUnits
  readonly settings: BaseProjectSettings
  readonly overlays: ASS<Overlay[]>
  readonly acquisitionParameters: BaseAcquisitionParameters
  readonly refreshLinesAndOverlays: VoidFunction
  readonly setMapStyle: (styleIndex: number) => void
  readonly fitOnMap: VoidFunction
}

interface BaseProjectSettings extends SerializableObject<JSONProjectSettings> {
  readonly arePointsLocked: ASS<boolean>
  readonly arePointsVisible: ASS<boolean>
  readonly arePointsLinked: ASS<boolean>
  readonly areOverlaysVisible: ASS<boolean>
  readonly pointsState: ASS<'value' | 'number' | 'nothing'>
  readonly map: BaseProjectMapSettings
}

interface BaseProjectMapSettings
  extends SerializableObject<JSONProjectMapSettings> {
  readonly styleIndex: ASS<MapStyleIndex>
  readonly zoom: ASS<number | undefined>
  readonly pitch: ASS<number | undefined>
  readonly rotation: ASS<number | undefined>
  readonly coordinates: ASS<LngLat | undefined>
}

interface BaseAcquisitionParameters
  extends SerializableObject<JSONAcquisitionParameters> {
  readonly nbSamples: ASS<number>
  readonly frequency: ASS<number>
  readonly preTrig: ASS<number>
  readonly smoothing: ASS<boolean | undefined>
}
