interface MaxidynThresholds extends BaseThresholds {
  readonly groups: MaxidynThresholdsGroups
}

type MaxidynThresholdsGroups = MaxidynUnitsSkeleton<ThresholdsGroup<string>>

type JSONMaxidynThresholdsConfigurationsVAny =
  JSONMaxidynThresholdsConfigurations

type JSONMaxidynThresholdsConfigurations = {
  version: 1
} & MaxidynUnitsSkeleton<JSONDistinctThresholdsConfiguration>
