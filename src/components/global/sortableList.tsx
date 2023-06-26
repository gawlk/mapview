import { ReactiveMap } from '@solid-primitives/map'
import type { DragEventHandler, Id } from '@thisbeyond/solid-dnd'
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  closestCenter,
  createSortable,
} from '@thisbeyond/solid-dnd'

import { classPropToString } from '/src/components'

interface SortableProps extends Solid.ParentProps {
  id: Id
  component: string | Solid.Component
  ref: (element: HTMLElement) => void
  index: number
}

const Sortable = (props: SortableProps) => {
  const sortable = createSortable(props.id)

  return (
    <Dynamic
      component={props.component}
      // The recommended way (and sugar coated version of the line below) is to use "use:sortable" but it isn't be possible with a Dynamic component
      ref={(el: HTMLElement) => {
        sortable(el)
        props.ref(el)
      }}
      index={props.index}
      class={classPropToString([sortable.isActiveDraggable && 'opacity-50'])}
    />
  )
}

interface Props<T extends any = any> {
  orientation: 'horizontal' | 'vertical'
  component: Solid.Component | string
  list: T[]
  itemToId: (item: T) => Id
}

export default <T,>(props: Props<T>) => {
  const [activeItem, setActiveItem] = createSignal<Id | null>(null)

  const ids = (): Id[] => props.list.map((item) => props.itemToId(item)) || []

  const elements = new ReactiveMap<Id, HTMLElement>()

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
      <div
        class={classPropToString([
          props.orientation === 'vertical' && 'flex-col',
          'flex gap-2 p-4',
        ])}
      >
        <SortableProvider ids={ids()}>
          <For each={props.list}>
            {(item, index) => {
              const id = props.itemToId(item)

              console.log('id', id)

              return (
                <Sortable
                  id={id}
                  ref={(element) => elements.set(id, element)}
                  component={props.component}
                  index={index()}
                />
              )
            }}
          </For>
        </SortableProvider>
      </div>
      <DragOverlay>
        <Dynamic
          component={props.component}
          ref={(_element: HTMLElement) => {
            const id = activeItem()

            if (!id) return

            const element = elements.get(id)

            if (!element) return

            _element.style.width = `${element.offsetWidth}px`
            _element.style.height = `${element.offsetHeight}px`
          }}
        />
      </DragOverlay>
    </DragDropProvider>
  )
}
