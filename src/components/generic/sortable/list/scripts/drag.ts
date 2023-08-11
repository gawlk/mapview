import { type DragEventHandler, type Id } from '@thisbeyond/solid-dnd'

export const createOnDragEnd =
  (
    ids: () => Id[],
    onChange: (from: number, to: number) => void,
    resetActiveItem: () => void,
  ): DragEventHandler =>
  ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = ids()

      const from = currentItems.indexOf(draggable.id)
      const to = currentItems.indexOf(droppable.id)

      if (from !== to) {
        onChange(from, to)
      }
    }

    resetActiveItem()
  }
