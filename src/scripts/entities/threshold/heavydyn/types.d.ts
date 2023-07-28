interface HeavydynThresholds extends BaseThresholds {
  readonly groups: HeavydynThresholdsGroups
}

type HeavydynThresholdsGroups = HeavydynUnitsSkeleton<ThresholdsGroup<string>>

type JSONHeavydynThresholdsConfigurationsVAny =
  | JSONHeavydynThresholdsConfigurations
  | JSONHeavydynThresholdsConfigurationsV1

type JSONHeavydynThresholdsConfigurations = {
  version: 2
} & HeavydynUnitsSkeleton<JSONDistinctThresholdsConfiguration>

type JSONHeavydynThresholdsConfigurationsV1 = {
  version: 1
} & HeavydynUnitsSkeletonV1<JSONDistinctThresholdsConfiguration>
