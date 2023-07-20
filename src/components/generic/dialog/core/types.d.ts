type DialogPropsWithHTMLAttributes = MergePropsWithHTMLProps<
  DialogProps,
  Solid.JSX.DialogHTMLAttributes
>

type DialogProps = DialogPropsOnly &
  Omit<InteractiveProps, keyof DialogPropsOnly>

// TODO: Add option to disable base close button

interface DialogPropsOnly {
  button?: InternalButtonProps

  attach?: HTMLElement

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

  onIdCreated?: (id: string) => void

  onOpenCreated?: (callback: DialogOpenFunction) => void
  onToggleCreated?: (callback: DialogToggleFunction) => void
  onCloseCreated?: (callback: DialogCloseFunction) => void

  onOpen?: () => void

  onClose?: (value?: string) => void

  onCloseEnd?: () => void
}

type DialogOpenFunction = (isUserEvent: boolean) => void

type DialogToggleFunction = (isUserEvent: boolean) => void

type DialogCloseFunction = (element?: HTMLElement) => void

type DialogResizeDirection = 'n' | 'nw' | 'w' | 'sw' | 's' | 'se' | 'e' | 'ne'

interface DialogPosition {
  left?: number
  top?: number
}

interface DialogDimensions {
  width?: number
  height?: number
}
