type HeadlessDialogPropsWithHTMLAttributes = MergePropsWithHTMLProps<
  DialogProps,
  DialogHTMLAttributes
>

type HeadlessDialogProps = DialogPropsOnly &
  Omit<InteractiveProps, keyof HeadlessDialogPropsOnly>

interface HeadlessDialogPropsOnly {
  attach?: HTMLElement

  title?: string

  sticky?: JSXElement

  form?: JSXElement

  maximized?: true

  full?: true

  footer?: JSXElement

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
