type DialogProps = DialogPropsOnly &
  Omit<InteractiveProps, keyof DialogPropsOnly>

// TODO: Add option to disable base close button

interface DialogPropsOnly {
  button?: InternalButtonProps

  position?: 'relative' | 'fixed' | 'full'

  title?: string

  sticky?: Solid.JSX.Element

  form?: Solid.JSX.Element

  full?: true

  footer?: Solid.JSX.Element

  moveable?: boolean

  resizable?: boolean

  maximizable?: boolean

  onClose?: (value?: string) => void

  onCloseEnd?: () => void
}

type DialogResizeDirection = 'w' | 'sw' | 's' | 'se' | 'e'

interface DialogTransform {
  x: number
  y: number
}

interface DialogDimensions {
  width?: number
  height?: number
}
