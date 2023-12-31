import { ReactiveMap } from '@solid-primitives/map'
import { useMousePosition } from '@solid-primitives/mouse'
import { createScrollPosition } from '@solid-primitives/scroll'
import { createTimer } from '@solid-primitives/timer'
import {
  createSortable,
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  useDragDropContext,
  type Id,
} from '@thisbeyond/solid-dnd'

import {
  createColliderCenter,
  createDraggedElement,
  createOnDragEnd,
  createRefCallback,
  getScrollableParent,
  scrollEffectCallback,
} from './scripts'

interface Props<T> {
  orientation: 'horizontal' | 'vertical' | 'both'
  list: T[]
  itemToId: (item: T) => Id
  component: (
    ref: (element: HTMLElement) => void,
    value: T,
    index: Accessor<number>,
  ) => JSXElement
  onChange: (from: number, to: number) => void
  disabled?: boolean
  draggedClasses?: ClassProp
}

const isDraggedClasses = 'opacity-50'

export const SortableList = <T,>(props: Props<T>) => {
  const [state, setState] = createStore({
    startingScrollX: 0,
    startingScrollY: 0,
    activeItem: null as Id | null,
    directParent: null as HTMLElement | null,
    scrollableParent: undefined as Window | HTMLElement | undefined,
  })

  const scrollableParentScroll = createScrollPosition(
    createMemo(() => state.scrollableParent),
  )

  const mousePosition = useMousePosition()

  const ids = createMemo(
    (): Id[] => props.list.map((item) => props.itemToId(item)) || [],
  )

  const sortables = new ReactiveMap<Id, HTMLElement>()

  createEffect(
    on(
      () => state.activeItem,
      () => {
        if (!state.activeItem) return

        createTimer(
          () =>
            scrollEffectCallback(
              state.scrollableParent,
              state.directParent,
              props.orientation,
              mousePosition.x,
              mousePosition.y,
            ),
          15,
          setInterval,
        )
      },
    ),
  )

  const draggedElement = createMemo(() =>
    createDraggedElement(
      state.activeItem,
      sortables,
      isDraggedClasses,
      props.draggedClasses,
    ),
  )

  return (
    <Show
      when={!props.disabled}
      fallback={
        <For each={props.list}>
          {(item, index) => (
            <Dynamic
              component={() =>
                props.component((element) => element, item, index)
              }
            />
          )}
        </For>
      }
    >
      <DragDropProvider
        onDragStart={({ draggable }) => {
          const element = sortables.get(draggable.id)

          if (element) {
            setState({
              directParent: element.parentElement,
              scrollableParent: getScrollableParent(element, props.orientation),
            })
          }

          setState({
            activeItem: draggable.id,
            startingScrollX: scrollableParentScroll.x,
            startingScrollY: scrollableParentScroll.y,
          })
        }}
        onDragEnd={createOnDragEnd(ids, props.onChange, () =>
          setState('activeItem', null),
        )}
        collisionDetector={createColliderCenter(
          scrollableParentScroll.x - state.startingScrollX,
          scrollableParentScroll.y - state.startingScrollY,
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
                      (element) =>
                        createRefCallback(
                          element,
                          sortable,
                          sortables,
                          id,
                          isDraggedClasses,
                          () => !!context?.[0].active.draggable,
                        ),
                      item,
                      index,
                    )
                  }
                />
              )
            }}
          </For>
        </SortableProvider>

        <DragOverlay
          style={{
            'z-index': 99999,
          }}
        >
          <Show when={draggedElement()}>
            {(element) => <Dynamic component={element} />}
          </Show>
        </DragOverlay>
      </DragDropProvider>
    </Show>
  )
}
