export const createSelectableList = <T, L extends T[] = T[]>(
  list: L,
  parameters?: {
    selected?: L[number]
    selectedIndex?: number | null
  }
): SelectableList<L[number], L> => {
  const selectedParameters = parameters?.selected

  let selected: L[number] | null = null

  if (typeof parameters?.selectedIndex === 'number') {
    selected = getSelectedFromIndexInList(parameters.selectedIndex, list)
  } else if (
    typeof parameters?.selected !== undefined &&
    list.includes(selectedParameters as L[number])
  ) {
    selected = selectedParameters as L[number]
  }

  return shallowReactive({
    selected,
    list: shallowReactive(list),
    selectIndex(index: number | null) {
      this.selected = getSelectedFromIndexInList(index, this.list)
    },
    getSelectedIndex() {
      const index = this.list.indexOf(this.selected as L[number])

      return index === -1 ? null : index
    },
    toJSON<TJSON, LJSON extends TJSON[] = TJSON[]>(
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
