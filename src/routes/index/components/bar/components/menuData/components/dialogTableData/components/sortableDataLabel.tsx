import { Button, SpanDataLabel } from '/src/components'

interface Props {
  ref: (el: HTMLElement) => void
  index: Solid.Accessor<number>
  dataLabel: DataLabel
  tableSelectedDataLabels: DataLabel[]
}

export const SortableDataLabel = (props: Props) => {
  return (
    <div ref={props.ref} class="flex">
      <Button
        full
        leftIcon={IconTablerHandStop}
        class="handle rounded-r-none"
        label={String(props.index() + 1)}
      >
        <SpanDataLabel dataLabel={props.dataLabel} includeCategory />
      </Button>
      <Button
        icon={IconTablerMinus}
        color="red"
        class="rounded-l-none border-l-black/10"
        onClick={() => {
          const index = props.tableSelectedDataLabels.findIndex(
            (dataLabel) => props.dataLabel === dataLabel
          )

          if (typeof index === 'number' && index !== -1) {
            props.tableSelectedDataLabels.splice(index, 1)
          }
        }}
      />
    </div>
  )
}
