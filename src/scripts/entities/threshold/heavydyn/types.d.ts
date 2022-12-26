interface HeavydynThresholds extends BaseThresholds {
  readonly groups: HeavydynThresholdsGroups
}

type HeavydynThresholdsGroups = HeavydynUnitsSkeleton<ThresholdsGroup<string>>
