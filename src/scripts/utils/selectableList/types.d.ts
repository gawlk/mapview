interface SelectableList<T, L extends T[] = T[]> {
  readonly selected: T | null
  readonly select: <T = L[number], S extends T = T>(s: S | null) => void
  readonly selectedIndex: number | null
  readonly selectFind: <K>(search: K, callback: (element: T) => K) => void
  readonly selectIndex: (i: number | null) => void
  readonly list: L
  readonly toJSON: <TJSON, LJSON extends TJSON[] = TJSON[]>(
    transform: (value: T) => LJSON[number],
    filter?: (value: T) => boolean
  ) => JSONSelectableList<TJSON, LJSON>
}

interface JSONSelectableList<T, L extends Array<T> = T[]> {
  readonly version: 1
  selectedIndex: number | null
  readonly list: L
}
