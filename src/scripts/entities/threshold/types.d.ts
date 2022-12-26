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

type AnyThreshold = PredefinedThreshold | CustomThreshold

type ThresoldsList = [...PredefinedThreshold[], CustomThreshold]

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
  readonly choices: SelectableList<AnyThreshold, ThresoldsList>
}
