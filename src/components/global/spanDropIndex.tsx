import { useAppState } from '/src/index'

interface Props {
  readonly dropIndex: MachineDropIndex
}

export const SpanDropIndex = (props: Props) => {
  const { t } = useAppState()

  return (
    <span>
      {props.dropIndex.displayedIndex}{' '}
      <span class="text-black/50">{`- ${t(props.dropIndex.type)}${
        props.dropIndex.machine === 'Heavydyn' && props.dropIndex.value
          ? ` (${props.dropIndex.value.displayedStringWithUnit()})`
          : ''
      }`}</span>
    </span>
  )
}
