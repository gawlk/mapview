type DialogProps = DialogPropsOnly &
  Omit<InteractiveProps, keyof DialogPropsOnly>

// TODO: Add option to disable base close button

interface DialogPropsOnly {
  button?: InternalButtonProps

  position?: 'attached' | 'relative' | 'fixed' | 'full'

  title?: string

  sticky?: Solid.JSX.Element

  form?: Solid.JSX.Element

  full?: true

  footer?: Solid.JSX.Element

  moveable?: boolean

  resizable?: boolean

  maximizable?: boolean

  hideCloseButton?: boolean

  onOpen?: () => void

  onClose?: (value?: string) => void

  onCloseEnd?: () => void
}

type DialogResizeDirection = 'n' | 'nw' | 'w' | 'sw' | 's' | 'se' | 'e' | 'ne'

interface DialogTransform {
  x: number
  y: number
}

interface DialogDimensions {
  width?: number
  height?: number
}
