type DialogValuesProps = ValuesProps<
  ValuesListProps | GroupedDialogSelectOptionsProps[]
>

interface GroupedDialogSelectOptionsProps {
  name: string
  // TODO: Change to ValuesListProps ?
  list: ValueWithTextProps[]
}
