import { createSortable, useDragDropContext } from '@thisbeyond/solid-dnd'

import { Button, SpanDataLabel, classPropToString } from '/src/components'

interface Props {
  index: number
  dataLabel: DataLabel
  tableSelectedDataLabels: DataLabel[]
}

export default (props: Props) => {
  const sortable = createSortable(props.dataLabel.toString())

  const context = useDragDropContext()
  const state = createMemo(() => context?.[0])
  const actions = createMemo(() => context?.[1])

  return (
    <div
      // @ts-ignore
      use:sortable
      class={classPropToString([
        sortable.isActiveDraggable && 'opacity-25',
        !!state()?.active.draggable && 'transition-transform',
        sortable.isActiveDroppable && 'z-[9999]',
      ])}
    >
      <Button
        full
        leftIcon={IconTablerHandStop}
        class="handle rounded-r-none"
        label={String(props.index + 1)}
      >
        <SpanDataLabel dataLabel={props.dataLabel} includeCategory />
      </Button>
      {/* <Button
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
      /> */}
    </div>
  )
}
