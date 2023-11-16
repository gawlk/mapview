interface MinidynThresholds extends BaseThresholds<MinidynThresholdsGroups> {}

type MinidynThresholdsGroups = MinidynUnitsSkeleton<ThresholdsGroup<string>>

type JSONMinidynThresholdsConfigurationsVAny =
  JSONMinidynThresholdsConfigurations

type JSONMinidynThresholdsConfigurations = {
  readonly version: 1
} & MinidynUnitsSkeleton<JSONDistinctThresholdsConfiguration>
