import { useI18n } from '@solid-primitives/i18n'

interface Props {
  dropIndex: MachineDropIndex
}

export default (props: Props) => {
  const [t] = useI18n()

  return (
    <span>
      {props.dropIndex.displayedIndex}{' '}
      <span class="text-black/50">{`- ${t(props.dropIndex.type)}${
        props.dropIndex.machine === 'Heavydyn' && props.dropIndex.value
          ? ` (${props.dropIndex.value.displayedStringWithUnit})`
          : ''
      }`}</span>
    </span>
  )
}
