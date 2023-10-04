import { useAppState } from '/src/index'

interface Props {
  dataLabel: DataLabel<string>
  includeCategory?: true
}

export const SpanDataLabel = (props: Props) => {
  const { t } = useAppState()

  return (
    <span class="flex-1 truncate text-left">
      {props.dataLabel.name}
      <Show when={props.includeCategory}>
        <span class="text-black/50">{` - ${t(
          props.dataLabel.category.name,
        )}`}</span>
      </Show>
    </span>
  )
}
