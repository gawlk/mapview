import { useI18n } from '@solid-primitives/i18n'

interface Props {
  threshold: AnyThreshold
  mathUnit?: MathUnit<string>
}

export const SpanThresholdName = (props: Props) => {
  const [t] = useI18n()

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
      {t(props.threshold.name || '', undefined, props.threshold.name)}
      <Show
        when={
          props.threshold.kind === 'custom' &&
          props.threshold.type !== 'Bicolor' &&
          props.threshold.value !== props.threshold.valueHigh &&
          props.threshold
        }
        fallback={
          <span class="text-black/50">{` - ${convertValueToString(
            props.threshold.value,
          )}`}</span>
        }
      >
        {(customThreshold) => (
          <span class="text-black/50">{` - ${convertValueToString(
            customThreshold().value,
            {},
          )} < ${convertValueToString(customThreshold().valueHigh)}`}</span>
        )}
      </Show>
    </span>
  )
}
