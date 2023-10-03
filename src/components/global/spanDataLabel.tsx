import { useI18n } from '@solid-primitives/i18n'

interface Props {
  dataLabel: DataLabel<string>
  includeCategory?: true
}

export const SpanDataLabel = (props: Props) => {
  const [t] = useI18n()

  return (
    <span class="flex-1 truncate text-left">
      {t(props.dataLabel.name, undefined, props.dataLabel.name)}
      <Show when={props.includeCategory}>
        <span class="text-black/50">{` - ${t(
          props.dataLabel.category.name,
        )}`}</span>
      </Show>
    </span>
  )
}
