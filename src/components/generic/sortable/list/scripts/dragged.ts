import { ReactiveMap } from "@solid-primitives/map"
import { Id } from "@thisbeyond/solid-dnd"
import { classPropToString } from "/src/components"

export const createDraggedElement = (id: Id | null, sortables: ReactiveMap<Id, HTMLElement>, isDraggedClasses: string, draggedClasses: ClassProp | undefined) => {
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

    if (draggedClasses) {
      copied.classList.add(
        ...classPropToString(draggedClasses).split(' ')
      )
    }

    return copied
}