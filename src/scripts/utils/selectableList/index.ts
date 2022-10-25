export const createSelectableList = <T>(
  list: T[],
  parameters?: {
    selected?: T | number | null
    index?: true // Used when T is of type number
  }
): SelectableList<T> => {
  const selected = parameters?.selected

  return shallowReactive({
    selected: (selected === undefined ||
    (typeof selected === 'number' &&
      (typeof list.at(0) !== 'number' || parameters?.index))
      ? getSelectedFromIndexInList(
          selected === undefined
            ? 0
            : typeof selected === 'number'
            ? selected
            : null,
          list
        )
      : list.includes(selected as T)
      ? selected
      : null) as T | null,
    list,
  })
}

export const getIndexOfSelectedInSelectableList = <T>(sl: SelectableList<T>) =>
  sl.selected ? sl.list.indexOf(sl.selected) : null

const getSelectedFromIndexInList = <T>(index: number | null, list: T[]) =>
  index !== null && list.length > 0 ? list.at(index) || list[0] : null
