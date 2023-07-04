interface Sortable {
  ref?: (element: HTMLElement) => void
}

interface SortablePoint {
  x: number
  y: number
}

// Solid DND type
type SolidDNDListeners = Record<
  string,
  (event: HTMLElementEventMap[keyof HTMLElementEventMap]) => void
>
