// ---
// JSON
// ---

type JSONHeavydynProjectVAny = JSONHeavydynProject

interface JSONHeavydynProject {
  readonly version: 1
  readonly machine: 'Heavydyn'
  readonly base: JSONBaseProject
  readonly distinct: JSONHeavydynProjectDistinct
}

interface JSONHeavydynProjectDistinct {
  readonly version: 1
  readonly units: JSONHeavydynUnits
  readonly calibrations: JSONHeavydynCalibrations
  readonly correctionParameters: JSONHeavydynCorrectionParameters
}

interface JSONHeavydynCalibrations {
  readonly version: 1
  readonly date: string
  readonly dPlate: number
  readonly channels: JSONChannel[]
  readonly sensors: JSONSensor[]
}

interface JSONChannel {
  readonly version: 1
  readonly name: string
  readonly position: string
  readonly gain: number
  readonly acquisition: number
  readonly type: 'LoadCell' | 'Geophone'
  readonly v0: number
}

interface JSONSensor {
  readonly version: 1
  readonly name: string
  readonly gain: number
  readonly type: 'AirTemp' | 'SurfTemp' | 'Dmi'
  readonly v0: number
}

interface JSONHeavydynCorrectionParameters {
  readonly version: 1
  readonly load: {
    readonly version: 1
    readonly active: boolean
    readonly loadReferenceSource: LoadReferenceSourceValue
    readonly customValue: number
  }
  readonly temperature: {
    readonly version: 1
    readonly active: boolean
    readonly temperatureFromSource: TemperatureFromSourceValue
    readonly average: TemperatureAverageValue
    readonly customValue: number
    readonly temperatureTo: number
    readonly structureType: number
  }
}

type LoadReferenceSourceValue = LoadReferenceSourceList[number]
type LoadReferenceSourceList = ['Sequence', 'Custom']

type TemperatureFromSourceValue = TemperatureFromSourceList[number]
type TemperatureFromSourceList = ['Tair', 'Tsurf', 'Tman', 'Custom']
type TemperatureAverageValue = TemperatureAverageList[number]
type TemperatureAverageList = ['Point', 'Zone', 'Report']
type TemperatureStructureTypeValue = TemperatureStructureTypeList[number]
type TemperatureStructureTypeList = [
  // TODO: Translate
  {
    name: 'Souple'
    k: 0.15
  },
  {
    name: 'Bitumineux épais'
    k: 0.2
  },
  {
    name: 'Mixte'
    k: 0.08
  },
  {
    name: 'Semi-rigide'
    k: 0.04
  }
]

// ---
// Object
// ---

interface HeavydynProject
  extends HeavydynObject<JSONHeavydynProject>,
    BaseProject<HeavydynReport, HeavydynMathUnits> {
  calibrations: HeavydynCalibrations
  correctionParameters: HeavydynCorrectionParameters
}

interface HeavydynCalibrations {
  readonly date: Date
  readonly dPlate: number
  readonly channels: JSONChannel[]
  readonly sensors: JSONSensor[]
}

interface HeavydynCorrectionParameters {
  readonly load: {
    active: boolean
    loadReferenceSource: SelectableList<
      LoadReferenceSourceValue,
      LoadReferenceSourceList
    >
    customValue: MathNumber
  }
  readonly temperature: {
    active: boolean
    temperatureFromSource: SelectableList<
      TemperatureFromSourceValue,
      TemperatureFromSourceList
    >
    average: SelectableList<TemperatureAverageValue, TemperatureAverageList>
    customValue: MathNumber
    temperatureTo: MathNumber
    structureType: SelectableList<
      TemperatureStructureTypeValue,
      TemperatureStructureTypeList
    >
  }
}
