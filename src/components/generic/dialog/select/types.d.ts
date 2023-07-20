type DialogSelectProps = DialogSelectPropsOnly & DialogClassicProps

interface DialogSelectPropsOnly extends SaveableProps {
  search?: Omit<InputPropsWithHTMLAttributes, 'onInput'>

  values: DialogValuesProps
}

