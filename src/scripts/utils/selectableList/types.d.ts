interface SelectableList<T, L extends T[] = T[]> {
  selected: T | null
  readonly list: L
  readonly selectIndex: (index: number | null) => void
  readonly toJSON: <TJSON, LJSON extends TJSON[] = TJSON[]>(
    transform: (value: T) => LJSON[number]
  ) => JSONSelectableList<TJSON, LJSON>
}

interface JSONSelectableList<T, L extends Array<T> = T[]> {
  selectedIndex: number | null
  readonly list: L
}
