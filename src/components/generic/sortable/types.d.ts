interface Sortable {
  readonly ref?: (element: HTMLElement) => void
}

interface SortablePoint {
  readonly x: number
  readonly y: number
}

// Solid DND type
type SolidDNDListeners = Record<
  string,
  (event: HTMLElementEventMap[keyof HTMLElementEventMap]) => void
>
