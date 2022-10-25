// ---
// JSON
// ---

type JSONHeavydynProjectVAny = JSONHeavydynProject

interface JSONHeavydynProject {
  readonly version: 1
  readonly base: JSONBaseProject
  readonly distinct: JSONHeavydynProjectDistinct
}

interface JSONHeavydynProjectDistinct {
  readonly version: 1
  readonly units: JSONHeavydynUnits
  readonly calibrations: JSONHeavydynCalibrations
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

// ---
// Object
// ---

interface HeavydynProject extends BaseProject {
  readonly machine: 'Heavydyn'
  readonly reports: SelectableList<HeavydynReport>
  readonly units: HeavydynMathUnits
  calibrations: HeavydynCalibrations
  toJSON: () => JSONHeavydynProject
}

interface HeavydynCalibrations {
  readonly date: Date
  readonly dPlate: number
  readonly channels: JSONChannel[]
  readonly sensors: JSONSensor[]
}
