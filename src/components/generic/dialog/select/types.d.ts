type DialogSelectProps = DialogSelectPropsOnly & DialogProps

interface DialogSelectOptionProps extends ButtonPropsWithHTMLAttributes {
  text?: string | (() => Solid.JSX.Element)
  value: string
}

interface GroupedDialogSelectOptionProps {
  name: string
  list: DialogSelectOptionProps[]
}

interface DialogSelectPropsOnly extends SaveableProps {
  search?: Omit<InputPropsWithHTMLAttributes, 'onInput'>

  options: {
    selected: string | number | null
    list:
      | string[]
      | DialogSelectOptionProps[]
      | GroupedDialogSelectOptionProps[]
  }
}
