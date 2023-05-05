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
    readonly source: LoadReferenceSourceValue
    readonly customValue: number
  }
  readonly temperature: {
    readonly version: 1
    readonly active: boolean
    readonly source: TemperatureFromSourceValue
    readonly average: TemperatureAverageValue
    readonly customValue: number
    readonly reference: number
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
  {
    name: 'Flexible'
    k: 0.15
  },
  {
    name: 'Thick flexible'
    k: 0.2
  },
  {
    name: 'Mixed'
    k: 0.08
  },
  {
    name: 'Semi-flexible'
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
    source: SelectableList<LoadReferenceSourceValue, LoadReferenceSourceList>
    customValue: MathNumber
  }
  readonly temperature: {
    active: boolean
    source: SelectableList<
      TemperatureFromSourceValue,
      TemperatureFromSourceList
    >
    average: SelectableList<TemperatureAverageValue, TemperatureAverageList>
    customValue: MathNumber
    reference: MathNumber
    structureType: SelectableList<
      TemperatureStructureTypeValue,
      TemperatureStructureTypeList
    >
  }
}
