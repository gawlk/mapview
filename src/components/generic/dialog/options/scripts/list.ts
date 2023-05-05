export const convertListToOptions = (
  list: DialogSelectOptionsProps['list']
): DialogSelectOptionProps[] => {
  const first = list.at(0)

  if (first) {
    if (typeof first !== 'string') {
      if ('list' in first) {
        return (list as (typeof first)[]).map((group) => group.list).flat()
      } else {
        return list as (typeof first)[]
      }
    } else {
      return list.map((value) => ({
        value: value as typeof first,
      }))
    }
  } else {
    return []
  }
}
