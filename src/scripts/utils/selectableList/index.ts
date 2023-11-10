import { createASS } from '/src/scripts'

export const createSelectableList = <T, L extends T[] = T[]>(
  list: L,
  parameters?: {
    selected?: L[number]
    selectedIndex?: number | null
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const selected = createASS<L[number] | null>(null)
  const selectedIndex = createASS<number | null>(null)

  const selectableList: SelectableList<L[number], L> = {
    selected,
    selectedIndex,
    list: createASS(list, {
      equals: false,
    }),
    select(s) {
      if (this.selected() !== s) {
        batch(() => {
          selected.set(() => s)
          this.selectIndex(this.list().indexOf(s) ?? null)
        })
      }
    },
    resetSelected() {
      selected.set(null)
      selectedIndex.set(null)
    },
    selectFind(search, callback) {
      const element = this.list().find(
        (_element) => callback(_element) === search,
      )

      if (element) {
        this.select(element)
      }

      return element
    },
    selectIndex(i) {
      i = i === -1 ? null : i

      if (i && (i < 0 || i >= this.list().length)) return

      if (i !== this.selectedIndex()) {
        selectedIndex.set(i)

        const value = getValueFromIndexInList<L[number]>(i, this.list())

        if (value !== null) {
          this.select(value)
        }
      }
    },
    push(value) {
      this.list.set((l) => {
        l.push(value)
        return l
      })
    },
    pushAndSelect(value) {
      batch(() => {
        this.push(value)
        this.select(value)
      })
    },
    removeIndex(index) {
      let value = null
      this.list.set((l) => {
        value = l.splice(index, 1)?.[0]
        return l
      })
      return value
    },
    toJSON<TJSON, LJSON extends TJSON[] = TJSON[]>(
      transform: (value: T) => TJSON,
      filter?: (value: T) => boolean,
    ): JSONSelectableList<TJSON, LJSON> {
      return {
        version: 1,
        selectedIndex: getIndexOfSelectedInSelectableList(this),
        list: (filter ? this.list().filter(filter) : this.list()).map((value) =>
          transform(value),
        ) as LJSON,
      }
    },
  }

  if (parameters?.selected !== undefined) {
    selectableList.select(parameters.selected)
  } else if (parameters?.selectedIndex !== undefined) {
    selectableList.selectIndex(
      parameters.selectedIndex === -1 ? 0 : parameters.selectedIndex,
    )
  }

  return selectableList
}

export const createSL = createSelectableList

export const getIndexOfSelectedInSelectableList = <T, L extends T[] = T[]>(
  sl: SelectableList<L[number], L>,
) => {
  const selected = sl.selected()

  return selected ? sl.list().indexOf(selected) : null
}

const getValueFromIndexInList = <T, L extends T[] = T[]>(
  index: number | null,
  list: L,
) => (index !== null && list.length > 0 ? list.at(index) || list[0] : null)
