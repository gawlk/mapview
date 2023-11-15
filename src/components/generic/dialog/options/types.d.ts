type DialogValuesProps = ValuesProps<
  ValuesListProps | GroupedDialogSelectOptionsProps[]
>

interface GroupedDialogSelectOptionsProps {
  readonly name: string
  readonly list: ValueWithTextProps[]
}
