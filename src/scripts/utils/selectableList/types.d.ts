interface SelectableList<K, V = K> {
  selected: K | null
  readonly list: V[]
}

interface SelectableOptionalList<K, V = K> {
  selected: K | null
  readonly list?: V[]
}
