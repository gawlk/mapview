export const createSelectableList = <T, L extends T[] = T[]>(
  list: L,
  parameters?: {
    selected?: L[number]
    selectedIndex?: number | null
  }
) => {
  const selectableList = createMutable<SelectableList<L[number], L>>({
    selected: null,
    select(s) {
      if (this.selected !== s) {
        // @ts-ignore
        this.selected = s

        this.selectIndex(this.list.indexOf(this.selected as L[number]))
      }
    },
    selectedIndex: null,
    selectFind(search, callback) {
      const element = this.list.find((element) => callback(element) === search)

      if (element) {
        this.select(element)
      }
    },
    selectIndex(i) {
      i = i === -1 ? null : i

      if (i && (i < 0 || i >= this.list.length)) {
        throw new Error(`SelectableList: selectIndex: ${i} is incorrect !`)
      }

      if (i !== this.selectedIndex) {
        // @ts-ignore
        this.selectedIndex = i

        this.select(getValueFromIndexInList<L[number]>(i, this.list))
      }
    },
    list,
    toJSON<TJSON, LJSON extends TJSON[] = TJSON[]>(
      transform: (value: T) => TJSON,
      filter?: (value: T) => boolean
    ): JSONSelectableList<TJSON, LJSON> {
      return {
        version: 1,
        selectedIndex: getIndexOfSelectedInSelectableList(this),
        list: (filter ? list.filter(filter) : list).map((value) =>
          // createMutable uses toJSON to hash so transform can be undefined
          typeof transform === 'function' ? transform(value) : value
        ) as LJSON,
      }
    },
  })

  const { selected, selectedIndex } = parameters || {}

  if (selected !== undefined) {
    selectableList.select(selected)
  } else if (selectedIndex !== undefined) {
    selectableList.selectIndex(selectedIndex)
  }

  return selectableList
}

export const getIndexOfSelectedInSelectableList = <T, L extends T[] = T[]>(
  sl: SelectableList<L[number], L>
) => (sl.selected ? sl.list.indexOf(sl.selected) : null)

const getValueFromIndexInList = <T, L extends T[] = T[]>(
  index: number | null,
  list: L
) => (index !== null && list.length > 0 ? list.at(index) || list[0] : null)
