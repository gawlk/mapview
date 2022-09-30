// ---
// JSON
// ---

type JSONHeavydynProjectVAny = JSONHeavydynProject

interface JSONHeavydynProject {
  version: 1
  base: JSONBaseProject
  distinct: JSONHeavydynProjectDistinct
}

interface JSONHeavydynProjectDistinct {
  version: 1
  units: JSONHeavydynUnits
  calibrations: JSONHeavydynCalibrations
}

interface JSONHeavydynCalibrations {
  version: 1
  readonly date: string
  readonly dPlate: number
  readonly channels: JSONChannel[]
  readonly sensors: JSONSensor[]
}

interface JSONChannel {
  version: 1
  name: string
  position: string
  gain: number
  acquisition: number
  type: 'LoadCell' | 'Geophone'
}

interface JSONSensor {
  version: 1
  name: string
  gain: number
  type: 'AirTemp' | 'SurfTemp' | 'Dmi'
}

// ---
// Object
// ---

interface HeavydynProject extends BaseProject {
  readonly machine: 'Heavydyn'
  readonly reports: SelectableList<HeavydynReport>
  readonly units: HeavydynMathUnits
  readonly information: HeavydynField[]
  readonly hardware: HeavydynField[]
  calibrations: HeavydynCalibrations
  toJSON: () => JSONHeavydynProject
}

interface HeavydynCalibrations {
  readonly date: Date
  readonly dPlate: number
  readonly channels: JSONChannel[]
  readonly sensors: JSONSensor[]
}
