type DialogProps = DialogPropsOnly &
  Omit<InteractiveProps, keyof DialogPropsOnly>

// TODO: Add option to disable base close button

interface DialogPropsOnly {
  button?: InternalButtonProps

  attached?: true

  title?: string

  sticky?: Solid.JSX.Element

  form?: Solid.JSX.Element

  maximized?: true

  full?: true

  footer?: Solid.JSX.Element

  moveable?: boolean

  resizable?: boolean

  maximizable?: boolean

  closeable?: boolean

  onOpen?: () => void

  onClose?: (value?: string) => void

  onCloseEnd?: () => void
}

type DialogResizeDirection = 'n' | 'nw' | 'w' | 'sw' | 's' | 'se' | 'e' | 'ne'

interface DialogPosition {
  left?: number
  top?: number
}

interface DialogDimensions {
  width?: number
  height?: number
}
