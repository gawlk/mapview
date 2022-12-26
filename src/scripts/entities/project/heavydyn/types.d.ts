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
  readonly correctionParameters?: JSONHeavydynCorrectionParameters
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
}

interface JSONSensor {
  readonly version: 1
  readonly name: string
  readonly gain: number
  readonly type: 'AirTemp' | 'SurfTemp' | 'Dmi'
}

interface JSONHeavydynCorrectionParameters {
  isLoadCorrection: boolean
  readonly loadParameters: {
    // Or boolean instead of optional object
    loadReferenceSource: SelectableList<
      LoadReferenceSourceList[number],
      LoadReferenceSourceList
    >
    customValue: MathNumber
  }
  isTemperatureCorrection: boolean
  readonly temperatureParameters: {
    // Temperature from > Temperature to
    temperatureFromSource: SelectableList<
      TemperatureFromSourceList[number],
      TemperatureFromSourceList
    >
    average: SelectableList<
      TemperatureAverageList[number],
      TemperatureAverageList
    >
    customValue: MathNumber
    temperatureTo: number // Given by the user, in France 15 deg celsius by default
    structureType: SelectableList<
      TemperatureStructureTypeList[number],
      TemperatureStructureTypeList
    >
  }
}

type LoadReferenceSourceList = ['Sequence' | 'Custom']

type TemperatureFromSourceList = ['Tair', 'Tsurf', 'Tman'] // Warning: Hard coded DataLabels names
type TemperatureAverageList = ['Point', 'Zone', 'Report', 'Custom']
type TemperatureStructureTypeList = ['1', '2', '3', '4']

// ---
// Object
// ---

interface HeavydynProject
  extends HeavydynObject<JSONHeavydynProject>,
    BaseProject<HeavydynReport, HeavydynMathUnits> {
  calibrations: HeavydynCalibrations
  correctionParameters?: JSONHeavydynCorrectionParameters
}

interface HeavydynCalibrations {
  readonly date: Date
  readonly dPlate: number
  readonly channels: JSONChannel[]
  readonly sensors: JSONSensor[]
}
