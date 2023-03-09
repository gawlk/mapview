// ---
// JSON
// ---

type JSONHeavydynCorrectionParametersVAny = JSONHeavydynCorrectionParameters

interface JSONHeavydynCorrectionParameters {
  readonly version: 1
  readonly load: JSONHeavydynLoadCorrectionParameters
  readonly temperature: JSONHeavydynTemperatureCorrectionParameters
}

type JSONHeavydynLoadCorrectionParametersVAny =
  | JSONHeavydynLoadCorrectionParametersV1
  | JSONHeavydynLoadCorrectionParameters

interface JSONHeavydynLoadCorrectionParametersV1 {
  readonly version: 1
  readonly active: boolean
  readonly loadReferenceSource: LoadSourceValue
  readonly customValue: number
}

interface JSONHeavydynLoadCorrectionParameters {
  readonly version: 2
  readonly active: boolean
  readonly source: LoadSourceValue
  readonly customValue: number
}

type JSONHeavydynTemperatureCorrectionParametersVAny =
  | JSONHeavydynTemperatureCorrectionParametersV1
  | JSONHeavydynTemperatureCorrectionParameters

interface JSONHeavydynTemperatureCorrectionParametersV1 {
  readonly version: 1
  readonly active: boolean
  readonly temperatureFromSource: TemperatureSourceValue
  readonly average: TemperatureAverageValue
  readonly customValue: number
  readonly temperatureTo: number
  readonly structureType: number
}

interface JSONHeavydynTemperatureCorrectionParameters {
  readonly version: 2
  readonly active: boolean
  readonly source: TemperatureSourceValue
  readonly average: TemperatureAverageValue
  readonly customValue: number
  readonly reference: number
  readonly structureType: number
}

type LoadSourceValue = LoadSourceList[number]
type LoadSourceList = ['Sequence', 'Custom']

type TemperatureSourceValue = TemperatureSourceList[number]
type TemperatureSourceList = ['Tair', 'Tsurf', 'Tman', 'Custom']
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

interface HeavydynCorrectionParameters {
  readonly load: HeavydynLoadCorrectionParameters
  readonly temperature: HeavydynTemperatureCorrectionParameters
}

interface HeavydynLoadCorrectionParameters {
  active: boolean
  source: SelectableList<LoadSourceValue, LoadSourceList>
  customValue: MathNumber
}

interface HeavydynTemperatureCorrectionParameters {
  active: boolean
  source: SelectableList<TemperatureSourceValue, TemperatureSourceList>
  average: SelectableList<TemperatureAverageValue, TemperatureAverageList>
  customValue: MathNumber
  reference: MathNumber
  structureType: SelectableList<
    TemperatureStructureTypeValue,
    TemperatureStructureTypeList
  >
}
