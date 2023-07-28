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
