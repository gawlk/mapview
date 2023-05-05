type DialogSelectProps = DialogSelectPropsOnly & DialogProps

interface DialogSelectPropsOnly extends SaveableProps {
  search?: Omit<InputPropsWithHTMLAttributes, 'onInput'>

  options: DialogSelectOptionsProps
}

interface DialogSelectOptionsProps {
  selected: string | number | null
  list: string[] | DialogSelectOptionProps[] | GroupedDialogSelectOptionsProps[]
}

interface DialogSelectOptionProps extends ButtonPropsWithHTMLAttributes {
  text?: string | (() => Solid.JSX.Element)
  value: string
}

interface GroupedDialogSelectOptionsProps {
  name: string
  list: DialogSelectOptionProps[]
}
