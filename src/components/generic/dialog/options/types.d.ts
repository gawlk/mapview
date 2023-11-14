type DialogValuesProps = ValuesProps<
  ValuesListProps | GroupedDialogSelectOptionsProps[]
>

interface GroupedDialogSelectOptionsProps {
  readonly name: string
  // TODO: Change to ValuesListProps ?
  readonly list: ValueWithTextProps[]
}
