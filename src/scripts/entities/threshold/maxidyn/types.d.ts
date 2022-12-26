interface MaxidynThresholds extends BaseThresholds {
  readonly groups: MaxidynThresholdsGroups
}

type MaxidynThresholdsGroups = MaxidynUnitsSkeleton<ThresholdsGroup<string>>
