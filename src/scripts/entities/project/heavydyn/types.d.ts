interface HeavydynProject extends BaseProject {
  readonly machine: 'Heavydyn'
  readonly reports: SelectableList<HeavydynReport>
  readonly units: HeavydynMathUnits
  calibrations: Calibrations
}

interface Calibrations {
  readonly date: Date
  readonly dPlate: number
  readonly channels: JSONChannel[]
  readonly sensors: JSONSensor[]
}

interface JSONCalibrations {
  readonly date: string
  readonly dPlate: number
  readonly channels: JSONChannel[]
  readonly sensors: JSONSensor[]
}

interface JSONChannel {
  name: string
  position: string
  gain: number
  acquisition: number
}

interface JSONSensor {
  name: string
  gain: number
}

interface JSONHeavydynProject extends JSONProject {
  calibrations: JSONCalibrations
}

interface HeavydynMathUnitsSkeleton<A, B = A, C = A, D = A, E = A> {
  deflection: A
  load: B
  temperature: C
  distance: D
  time: E
}

type HeavydynMathUnits = HeavydynMathUnitsSkeleton<MathUnit>

type PossibleHeavydynDeflectionUnits = 'mm' | '1/100 mm' | 'um'
type PossibleHeavydynForceUnits = 'N' | 'kN' | 'lbs'
type PossibleHeavydynTemperatureUnits = '°C' | '°F' | 'K'
type PossibleHeavydynDistanceUnits = 'm' | 'km' | 'mi'
type PossibleHeavydynTimeUnits = 's' | 'ms' | 'us'

type JSONHeavydynUnits = HeavydynMathUnitsSkeleton<
  PossibleHeavydynDeflectionUnits,
  PossibleHeavydynForceUnits,
  PossibleHeavydynTemperatureUnits,
  PossibleHeavydynDistanceUnits,
  PossibleHeavydynTimeUnits
>

type HeavydynMathUnitsNames = keyof HeavydynMathUnitsSkeleton<any>
