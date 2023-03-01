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
    list: shallowReactive(list),
    selectIndex: function (index: number | null) {
      this.selected = getSelectedFromIndexInList(index, this.list)
    },
    getSelectedIndex: function () {
      const index = this.list.indexOf(this.selected as L[number])

      return index === -1 ? null : index
    },
    toJSON: function <TJSON, LJSON extends TJSON[] = TJSON[]>(
      transform: (value: T) => TJSON,
      filter?: (value: T) => boolean
    ): JSONSelectableList<TJSON, LJSON> {
      return {
        version: 1,
        selectedIndex: getIndexOfSelectedInSelectableList(this),
        list: (filter ? list.filter(filter) : list).map((value) =>
          transform(value)
        ) as LJSON,
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
