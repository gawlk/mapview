type DialogSelectProps = DialogSelectPropsOnly & DialogClassicProps

interface DialogSelectPropsOnly extends SaveableProps {
  readonly search?: Omit<InputPropsWithHTMLAttributes, 'onInput'>

  readonly values: DialogValuesProps
}
