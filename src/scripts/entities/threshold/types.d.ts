// ---
// JSON
// ---

interface JSONDistinctThresholdsConfiguration {
  version: 1
  selectedIndex: number
  custom: JSONCustomThreshold
}

// ---
// Object
// ---

interface Threshold {
  readonly kind: 'predefined' | 'custom'
  readonly name: string
  readonly unit: MathUnit<string>
  value: number
  readonly getColor: (
    mathNumber: MathNumber,
    colors: JSONThresholdColors,
  ) => string
}

type AnyThreshold = PredefinedThreshold | CustomThreshold

type CustomThresholdIndex = 0
type ThresoldsList = [CustomThreshold, ...PredefinedThreshold[]]

type MachineThresholds =
  | HeavydynThresholds
  | MaxidynThresholds
  | MinidynThresholds

type MachineThresholdsGroups =
  | HeavydynThresholdsGroups
  | MaxidynThresholdsGroups
  | MinidynThresholdsGroups

interface ThresholdsGroup<T> {
  readonly unit: MathUnit<T>
  readonly choices: ThresholdsGroupChoices
}

type ThresholdsGroupChoices = SelectableList<AnyThreshold, ThresoldsList>
