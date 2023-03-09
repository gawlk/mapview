interface SelectableList<T, L extends T[] = T[]> {
  selected: T | null
  readonly list: L
  readonly selectIndex: (index: number | null) => void
  readonly getSelectedIndex: () => number | null
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
