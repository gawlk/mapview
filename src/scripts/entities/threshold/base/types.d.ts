interface BaseThresholds<
  ThresholdsGroups extends BaseThresholdsGroups = MachineThresholdsGroups,
> {
  readonly groups: ThresholdsGroups
  readonly colors: ThresholdColors
  readonly inputs: ThresholdInputs
}

interface ThresholdColors {
  readonly low: ASS<ColorName>
  readonly middle: ASS<ColorName>
  readonly high: ASS<ColorName>
}

interface ThresholdInputs {
  readonly isRequiredARange: ASS<boolean>
  readonly isOptionalARange: ASS<boolean>
}

type BaseThresholdsGroups = MachineUnitsSkeleton<ThresholdsGroup<string>>
