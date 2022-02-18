export const createSelectableList = <K, V = K>(
  selected: K | null,
  list: V[],
  reactive?: true
): SelectableList<K, V> => {
  return reactive
    ? shallowReactive({
        selected,
        list: shallowReactive(list),
      })
    : {
        selected,
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
