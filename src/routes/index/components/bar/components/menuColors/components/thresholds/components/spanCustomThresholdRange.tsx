import { useI18n } from '@solid-primitives/i18n'

interface Props {
  name?: string
  mathUnit?: MathUnit<string>
  from?: number
  to?: number
}

export const SpanCustomThresholdRange = (props: Props) => {
  const [t] = useI18n()

  const formatValue = (value?: number) =>
    `${props.mathUnit?.baseToCurrent(value || 0).toLocaleString()} ${props
      .mathUnit?.currentUnit}`

  return (
    <span
      classList={{ 'line-through': props.to === props.from }}
    >{`${formatValue(props.from)} ≤ ${t(
      props.name || '',
      undefined,
      props.name,
    )} < ${formatValue(props.to)}`}</span>
  )
}
