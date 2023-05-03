interface BaseThresholds<
  ThresholdsGroups extends BaseThresholdsGroups = MachineThresholdsGroups
> {
  readonly groups: ThresholdsGroups
  readonly colors: JSONThresholdColors
  readonly inputs: JSONThresholdInputs
}

type BaseThresholdsGroups = MachineUnitsSkeleton<ThresholdsGroup<string>>
