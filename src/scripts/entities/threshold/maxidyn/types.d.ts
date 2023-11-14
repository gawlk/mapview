interface MaxidynThresholds extends BaseThresholds {
  readonly groups: MaxidynThresholdsGroups
}

type MaxidynThresholdsGroups = MaxidynUnitsSkeleton<ThresholdsGroup<string>>

type JSONMaxidynThresholdsConfigurationsVAny =
  JSONMaxidynThresholdsConfigurations

type JSONMaxidynThresholdsConfigurations = {
  readonly version: 1
} & MaxidynUnitsSkeleton<JSONDistinctThresholdsConfiguration>
