import { ReactiveMap } from '@solid-primitives/map'
import { useMousePosition } from '@solid-primitives/mouse'
import { createScrollPosition } from '@solid-primitives/scroll'
import type { DragEventHandler, Id } from '@thisbeyond/solid-dnd'
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  createSortable,
  transformStyle,
  useDragDropContext,
} from '@thisbeyond/solid-dnd'

import { createColliderCenter, getScrollableParent } from './scripts'

import { classPropToString } from '/src/components'

interface Props<T> {
  list: T[]
  itemToId: (item: T) => Id
  component: (
    ref: (element: HTMLElement) => void,
    dragActivators: () => SolidDNDListeners,
    transformStyle: () => Solid.JSX.CSSProperties,
    value: T,
    index: Solid.Accessor<number>,
    classes: () => ClassProp
  ) => Solid.JSX.Element
  onChange: (from: number, to: number) => void
  draggedClasses?: ClassProp
}

const isDraggedClasses = 'opacity-50'

export default <T,>(props: Props<T>) => {
  const [state, setState] = createStore({
    startingScrollY: 0,
    activeItem: null as Id | null,
    directParent: null as HTMLElement | null,
    scrollableParent: undefined as Window | HTMLElement | undefined,
  })

  const scrollableParentScroll = createScrollPosition(
    () => state.scrollableParent
  )

  const mousePosition = useMousePosition()

  const ids = createMemo(
    (): Id[] => props.list.map((item) => props.itemToId(item)) || []
  )

  const sortables = new ReactiveMap<Id, HTMLElement>()

  const onDragStart: DragEventHandler = ({ draggable }) => {
    const element = sortables.get(draggable.id)

    if (element) {
      setState({
        directParent: element.parentElement,
        scrollableParent: getScrollableParent(element),
      })

      console.log(state.directParent, state.scrollableParent)
    }

    setState({
      activeItem: draggable.id,
      startingScrollY: scrollableParentScroll.y,
    })
  }

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = ids()

      const from = currentItems.indexOf(draggable.id)
      const to = currentItems.indexOf(droppable.id)

      if (from !== to) {
        props.onChange(from, to)
      }
    }

    setState('activeItem', null)
  }

  createEffect(
    on(
      () => state.activeItem,
      () =>
        state.activeItem &&
        createEffect(
          on(
            () => mousePosition.y,
            (mouseY) =>
              createEffect(
                on(
                  () => scrollableParentScroll.y,
                  () => {
                    const { scrollableParent, directParent } = state

                    if (!scrollableParent || !directParent) return

                    const { scrollY: windowScrollY } = window

                    const inc = 5

                    const {
                      top: scrollableTop,
                      bottom: scrollableBottom,
                      height: scrollableHeight,
                    } = 'getBoundingClientRect' in scrollableParent
                      ? scrollableParent.getBoundingClientRect()
                      : {
                          top: 0,
                          bottom: window.innerHeight,
                          height: window.innerHeight,
                        }

                    const pad = scrollableHeight / 10

                    const { bottom: parentBottom, top: parentTop } =
                      directParent.getBoundingClientRect()

                    if (
                      scrollableBottom - pad < parentBottom &&
                      mouseY - windowScrollY > scrollableHeight - pad
                    ) {
                      scrollableParent.scrollBy(0, inc)
                    } else if (
                      scrollableTop + pad > parentTop &&
                      mouseY - windowScrollY < scrollableTop + pad
                    ) {
                      scrollableParent.scrollBy(0, -inc)
                    }
                  }
                )
              )
          )
        )
    )
  )

  const draggedOuterHTML = createMemo(() => {
    const id = state.activeItem
    if (!id) return

    const sortable = sortables.get(id)
    if (!sortable) return

    const copied = sortable.cloneNode(true) as HTMLElement

    const rect = sortable.getBoundingClientRect()
    copied.style.width = `${rect.width}px`
    copied.style.height = `${rect.height}px`
    copied.style.transform = ''

    copied.classList.remove(
      ...classPropToString(isDraggedClasses.split(' ')).split(' ')
    )

    if (props.draggedClasses) {
      copied.classList.add(
        ...classPropToString(props.draggedClasses).split(' ')
      )
    }

    return copied
  })

  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetector={createColliderCenter(
        scrollableParentScroll.y - state.startingScrollY
      )}
    >
      <DragDropSensors />

      <SortableProvider ids={ids()}>
        <For each={props.list}>
          {(item, index) => {
            const id = props.itemToId(item)

            const sortable = createSortable(id)

            const context = useDragDropContext()

            return (
              <Dynamic
                component={() =>
                  props.component(
                    (element) => {
                      sortables.set(id, element)
                      sortable.ref(element)
                    },
                    () => sortable.dragActivators,
                    () => transformStyle(sortable.transform),
                    item,
                    index,
                    () => [
                      sortable.isActiveDraggable && isDraggedClasses,
                      !!context?.[0].active.draggable && 'transition-transform',
                    ]
                  )
                }
              />
            )
          }}
        </For>
      </SortableProvider>

      <DragOverlay
        style={{
          'z-index': 999999999999,
        }}
      >
        <Show when={draggedOuterHTML()}>
          {(element) => <Dynamic component={element} />}
        </Show>
      </DragOverlay>
    </DragDropProvider>
  )
}
