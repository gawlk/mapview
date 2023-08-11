import { convertValuesPropsListToValuesWithTextProps } from '/src/components'

export const convertDialogValuesPropsListToValuesWithTextProps = (
  list: DialogValuesProps['list'],
): ValueWithTextProps[] => {
  const first = list.at(0)

  if (first && typeof first !== 'string' && 'list' in first) {
    return (list as (typeof first)[]).map((group) => group.list).flat()
  } else {
    return convertValuesPropsListToValuesWithTextProps(list as ValuesListProps)
  }
}
