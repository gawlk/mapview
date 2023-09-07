import { useI18n } from '@solid-primitives/i18n'

interface Props {
  name: string
  mathUnit?: MathUnit<string>
  from: number
  to: number
  last: boolean
  setEquals?: (equals: boolean) => void
}

export const SpanCustomThresholdRange = (props: Props) => {
  const [t] = useI18n()

  const formatValue = (value?: number) =>
    `${props.mathUnit?.baseToCurrent(value || 0).toLocaleString()} ${props
      .mathUnit?.currentUnit}`

  const min = createMemo(() => props.mathUnit?.min ?? -Infinity)

  const max = createMemo(() => props.mathUnit?.max ?? Infinity)

  const cappedFrom = createMemo(() => Math.max(props.from, min()))
  const to = createMemo(() => Math.min(props.to, max()))

  const from = createMemo(() => Math.min(cappedFrom(), to()))

  const formattedFrom = createMemo(() => formatValue(from()))
  const formattedTo = createMemo(() => formatValue(to()))

  const equals = createMemo(() => formattedFrom() !== formattedTo())

  createEffect(() => props.setEquals?.(!equals()))

  return (
    <Show
      when={equals()}
      fallback={
        <span>{`${t(
          props.name || '',
          undefined,
          props.name,
        )} = ${formattedTo()}`}</span>
      }
    >
      <span>{`${formattedFrom()} ≤ ${t(
        props.name || '',
        undefined,
        props.name,
      )} ${props.last ? '≤' : '<'} ${formattedTo()}`}</span>
    </Show>
  )
}
