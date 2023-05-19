type DialogSelectProps = DialogSelectPropsOnly & DialogProps

interface DialogSelectPropsOnly extends SaveableProps {
  search?: Omit<InputPropsWithHTMLAttributes, 'onInput'>

  values: DialogValuesProps
}

type DialogValuesProps = ValuesProps<
  ValuesListProps | GroupedDialogSelectOptionsProps[]
>

interface GroupedDialogSelectOptionsProps {
  name: string
  list: ValueWithTextProps[]
}
