import { useI18n } from '@solid-primitives/i18n'

interface Props {
  dataLabel: DataLabel<string>
  includeCategory?: true
}

export default (props: Props) => {
  const [t] = useI18n()

  return (
    <span class="truncate">
      {props.dataLabel.name}
      <Show when={props.includeCategory}>
        <span class="text-black/50">{` - ${t(
          props.dataLabel.category.name
        )}`}</span>
      </Show>
    </span>
  )
}
