import { ReactiveMap } from "@solid-primitives/map"
import { type Id, transformStyle } from "@thisbeyond/solid-dnd"
import { createSortable } from '@thisbeyond/solid-dnd'

export const createRefCallback = (element: HTMLElement, sortable: ReturnType<typeof createSortable>, sortables: ReactiveMap<Id, HTMLElement>, id: Id, isDraggedClasses: string, activeDraggable: () => boolean) => {
  sortable.ref(element)

  sortables.set(id, element)

  createEffect(() => {
    const handle =
      element.getElementsByClassName('handle')?.[0] ||
      element

    Object.entries(sortable.dragActivators).forEach(
      // @ts-ignore
      ([key, f]) => (handle[key] = f)
    )
  })

  createEffect(
    () =>
      (element.style.transform =
        transformStyle(sortable.transform).transform || '')
  )

  createEffect(() => {
    const splitClasses = isDraggedClasses.split(' ')

    sortable.isActiveDraggable
      ? element.classList.add(...splitClasses)
      : element.classList.remove(...splitClasses)
  })

  createEffect(() =>
    activeDraggable()
      ? element.classList.add('transition-transform')
      : element.classList.remove('transition-transform')
  )
}