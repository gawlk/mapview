import { useI18n } from '@solid-primitives/i18n'

interface Props {
  dataLabel: DataLabel<string>
}

export default (props: Props) => {
  const [t] = useI18n()

  return (
    <span>
      {props.dataLabel.name}{' '}
      <span class="text-black/50">{`- ${t(props.dataLabel.unit.name)} - ${t(
        props.dataLabel.category.name
      )}`}</span>
    </span>
  )
}
