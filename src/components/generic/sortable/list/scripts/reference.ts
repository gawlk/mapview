import { ReactiveMap } from '@solid-primitives/map'
import { createSortable, transformStyle, type Id } from '@thisbeyond/solid-dnd'

export const createRefCallback = (
  element: HTMLElement,
  sortable: ReturnType<typeof createSortable>,
  sortables: ReactiveMap<Id, HTMLElement>,
  id: Id,
  isDraggedClasses: string,
  activeDraggable: () => boolean,
) => {
  sortable.ref(element)

  sortables.set(id, element)

  createEffect(() => {
    const handle = element.getElementsByClassName('handle')?.[0] || element

    Object.entries(sortable.dragActivators).forEach(([key, f]) => {
      // @ts-expect-error Types failing
      handle[key] = f
    })
  })

  createEffect(() => {
    element.style.transform = transformStyle(sortable.transform).transform || ''
  })

  createEffect(() => {
    const splitClasses = isDraggedClasses.split(' ')

    sortable.isActiveDraggable
      ? element.classList.add(...splitClasses)
      : element.classList.remove(...splitClasses)
  })

  createEffect(() =>
    activeDraggable()
      ? element.classList.add('transition-transform')
      : element.classList.remove('transition-transform'),
  )
}
