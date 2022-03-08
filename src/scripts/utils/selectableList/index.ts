export const createSelectableList = <T>(
  selected: T | number | null,
  list: T[],
  parameters: {
    reactive?: true
    isSelectedAnIndex?: true
  }
): SelectableList<T> => {
  const _selected = (
    parameters.isSelectedAnIndex
      ? getObjectFromSelectedIndexInSelectableList(
          selected as number | null,
          list
        )
      : selected
  ) as T | null

  return parameters.reactive
    ? shallowReactive({
        selected: _selected,
        list: shallowReactive(list),
      })
    : {
        selected: _selected,
        list,
      }
}

export const getObjectFromSelectedIndexInSelectableList = <T>(
  selectedIndex: number | null,
  objectsList: T[]
) =>
  selectedIndex !== null && objectsList.length > 0
    ? objectsList[selectedIndex < objectsList.length ? selectedIndex : 0]
    : null
