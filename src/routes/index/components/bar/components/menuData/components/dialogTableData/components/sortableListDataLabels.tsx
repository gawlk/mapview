import {
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  DragOverlay,
  Id,
  SortableProvider,
  closestCenter,
} from '@thisbeyond/solid-dnd'

import store from '/src/store'

import SortableDataLabel from './sortableDataLabel'

export default () => {
  const tableSelectedDataLabels = createMemo(
    () => store.selectedReport?.dataLabels.table.selected?.dataLabels
  )

  const [activeItem, setActiveItem] = createSignal<Id | null>(null)

  const ids = (): Id[] =>
    tableSelectedDataLabels()?.map((dataLabel) => dataLabel.toString()) || []

  const onDragStart: DragEventHandler = ({ draggable }) =>
    setActiveItem(draggable.id)

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = ids()

      const fromIndex = currentItems.indexOf(draggable.id)

      const toIndex = currentItems.indexOf(droppable.id)

      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice()
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1))

        // setItems(updatedItems)
      }
    }
  }

  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetector={closestCenter}
    >
      <DragDropSensors />
      <div class="space-y-2">
        <SortableProvider ids={ids()}>
          <For each={tableSelectedDataLabels()}>
            {(dataLabel, index) => (
              <SortableDataLabel
                dataLabel={dataLabel}
                index={index()}
                tableSelectedDataLabels={tableSelectedDataLabels() || []}
              />
            )}
          </For>
        </SortableProvider>
      </div>
      <DragOverlay class="z-[9999]">
        <div class="sortable">{activeItem()}</div>
      </DragOverlay>
    </DragDropProvider>
  )
}
