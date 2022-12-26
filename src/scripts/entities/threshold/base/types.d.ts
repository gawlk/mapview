interface BaseThresholds<
  ThresholdsGroups extends BaseThresholdsGroups = BaseThresholdsGroups
> {
  readonly groups: ThresholdsGroups
  readonly colors: JSONThresholdColors
  readonly inputs: JSONThresholdInputs
}

type BaseThresholdsGroups = MachineUnitsSkeleton<ThresholdsGroup<string>>
