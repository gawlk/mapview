type AnyThreshold = PredefinedThreshold | CustomThreshold

interface JSONDistinctThresholdsConfiguration {
  version: 1
  selected: number
  custom: JSONCustomThreshold
}
