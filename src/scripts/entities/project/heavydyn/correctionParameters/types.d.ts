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
  },
]

// ---
// Object
// ---

interface HeavydynCorrectionParameters
  extends SerializableObject<JSONHeavydynCorrectionParameters> {
  readonly load: HeavydynLoadCorrectionParameters
  readonly temperature: HeavydynTemperatureCorrectionParameters
}

interface HeavydynLoadCorrectionParameters
  extends SerializableObject<JSONHeavydynLoadCorrectionParameters> {
  readonly active: ASS<boolean>
  readonly source: SelectableList<LoadSourceValue, LoadSourceList>
  readonly customValue: WritableMathNumber
}

interface HeavydynTemperatureCorrectionParameters
  extends SerializableObject<JSONHeavydynTemperatureCorrectionParameters> {
  readonly active: ASS<boolean>
  readonly source: SelectableList<TemperatureSourceValue, TemperatureSourceList>
  readonly average: SelectableList<
    TemperatureAverageValue,
    TemperatureAverageList
  >
  readonly customValue: WritableMathNumber
  readonly reference: WritableMathNumber
  readonly structureType: SelectableList<
    TemperatureStructureTypeValue,
    TemperatureStructureTypeList
  >
}
