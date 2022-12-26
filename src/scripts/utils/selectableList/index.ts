export const createSelectableList = <T, L extends T[] = T[]>(
  list: L,
  parameters?: {
    selected?: L[number]
    selectedIndex?: number | null
  }
): SelectableList<L[number], L> => {
  const selected = parameters?.selected

  return shallowReactive({
    selected: parameters
      ? typeof parameters.selectedIndex === 'number'
        ? getSelectedFromIndexInList(parameters.selectedIndex, list)
        : typeof parameters.selected !== 'undefined'
        ? list.includes(selected as L[number])
          ? (selected as L[number])
          : null
        : null
      : null,
    list,
    selectIndex: function (index: number | null) {
      this.selected = getSelectedFromIndexInList(index, this.list)
    },
    toJSON: function <TJSON, LJSON extends TJSON[] = TJSON[]>(
      transform: (value: T) => TJSON
    ): JSONSelectableList<TJSON, LJSON> {
      return {
        selectedIndex: getIndexOfSelectedInSelectableList(this),
        list: list.map((value) => transform(value)) as LJSON,
      }
    },
  })
}

export const getIndexOfSelectedInSelectableList = <T, L extends T[] = T[]>(
  sl: SelectableList<T, L>
) => (sl.selected ? sl.list.indexOf(sl.selected) : null)

const getSelectedFromIndexInList = <T, L extends T[] = T[]>(
  index: number | null,
  list: L
) => (index !== null && list.length > 0 ? list.at(index) || list[0] : null)
