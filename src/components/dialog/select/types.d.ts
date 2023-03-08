type DialogSelectProps = DialogSelectPropsOnly & DialogProps

interface DialogSelectValueObject {
  value: string
  label?: string | Solid.JSX.Element
  icon?: IconProp
}

interface DialogSelectPropsOnly extends SaveableProps {
  search?: Omit<InputPropsWithHTMLAttributes, 'onInput'>

  list: {
    selected: string | number | null
    values: string[] | DialogSelectValueObject[]
  }
}
