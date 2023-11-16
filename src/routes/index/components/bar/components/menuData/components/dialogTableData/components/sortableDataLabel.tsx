import { Button, SpanDataLabel } from '/src/components'

interface Props {
  readonly ref: (el: HTMLElement) => void
  readonly index: Accessor<number>
  readonly dataLabel: DataLabel
  readonly tableSelectedDataLabels: DataLabel[]
}

export const SortableDataLabel = (props: Props) => {
  return (
    <div ref={props.ref} class="flex">
      <div class="hidden w-full min-w-0 lg:block">
        <Button
          full
          leftIcon={IconTablerHandStop}
          // eslint-disable-next-line tailwindcss/no-custom-classname
          class="handle  rounded-r-none "
          label={String(props.index() + 1)}
        >
          <SpanDataLabel dataLabel={props.dataLabel} includeCategory />
        </Button>
      </div>
      <div class="block w-full min-w-0 lg:hidden">
        <Button
          full
          kind="static"
          class="rounded-r-none"
          label={String(props.index() + 1)}
        >
          <SpanDataLabel dataLabel={props.dataLabel} includeCategory />
        </Button>
      </div>
      <Button
        icon={IconTablerMinus}
        color="red"
        class="rounded-l-none border-l-black/10"
        onClick={() => {
          const index = props.tableSelectedDataLabels.findIndex(
            (dataLabel) => props.dataLabel === dataLabel,
          )

          if (typeof index === 'number' && index !== -1) {
            props.tableSelectedDataLabels.splice(index, 1)
          }
        }}
      />
    </div>
  )
}
