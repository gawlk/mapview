import { useAppState } from '/src/index'

interface Props {
  readonly threshold: AnyThreshold
  readonly mathUnit?: MathUnit<string>
}

export const SpanThresholdName = (props: Props) => {
  const { t } = useAppState()

  const convertValueToString = (
    value: number,
    options?: MathUnitGetLocaleStringOptions | undefined,
  ) =>
    props.mathUnit?.valueToLocaleString(
      value,
      options ?? { appendUnitToString: true },
    )

  return (
    <span>
      {t(props.threshold.name) || props.threshold.name}
      <Show
        when={
          props.threshold.kind === 'custom' &&
          props.threshold.type() !== 'Bicolor' &&
          props.threshold.value !== props.threshold.valueHigh &&
          props.threshold
        }
        fallback={
          <span class="text-black/50">{` - ${convertValueToString(
            props.threshold.value(),
          )}`}</span>
        }
      >
        {(customThreshold) => (
          <span class="text-black/50">{` - ${convertValueToString(
            customThreshold().value(),
            {},
          )} < ${convertValueToString(customThreshold().valueHigh())}`}</span>
        )}
      </Show>
    </span>
  )
}
