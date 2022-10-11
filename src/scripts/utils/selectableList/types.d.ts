interface SelectableList<S, L = S> {
  selected: S | null
  readonly list: Array<L>
}

interface SelectableOptionalList<S, L = S> {
  selected: S | null
  readonly list?: Array<L>
}
