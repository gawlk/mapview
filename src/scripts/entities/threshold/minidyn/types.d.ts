interface MinidynThresholds extends BaseThresholds<MinidynThresholdsGroups> {}

type MinidynThresholdsGroups = MinidynUnitsSkeleton<ThresholdsGroup<string>>

type JSONMinidynThresholdsConfigurationsVAny =
  JSONMinidynThresholdsConfigurations

type JSONMinidynThresholdsConfigurations = {
  version: 1
} & MinidynUnitsSkeleton<JSONDistinctThresholdsConfiguration>
