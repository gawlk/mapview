type DialogProps = DialogPropsOnly &
  Omit<InteractiveProps, keyof DialogPropsOnly>

interface DialogPropsOnly {
  button?: DialogButtonProps

  size?: 'small' | 'normal' | 'fullscreen'

  title?: string

  sticky?: Solid.JSX.Element

  form?: Solid.JSX.Element

  full?: true

  onClose?: (value?: string) => void
}

type DialogButtonProps = DialogButtonPropsOnly & ButtonPropsWithHTMLAttributes

interface DialogButtonPropsOnly {
  text?: string | Solid.JSX.Element
}
