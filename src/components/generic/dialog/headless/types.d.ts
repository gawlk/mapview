type HeadlessDialogPropsWithHTMLAttributes = MergePropsWithHTMLProps<
  HeadlessDialogProps,
  DialogHTMLAttributes
>

interface HeadlessDialogProps {
  component?: string

  full?: Accessor<boolean>

  attach?: Accessor<HTMLElement | undefined>

  title?: string

  sticky?: JSXElement

  form?: JSXElement
  handle?: Accessor<HTMLElement | undefined>

  maximized?: true
  full?: true

  footer?: JSXElement

  moveable?: boolean
  resizable?: boolean
  maximizable?: boolean

  position?: DialogPositionProp

  dimensions?: DialogDimensionsProp

  backdrop?: boolean

  classes?: ClassProp
  classesOpen?: ClassProp
  classesMoveable?: ClassProp
  classesAbsolute?: ClassProp
  classesWindowed?: ClassProp
  classesFixed?: ClassProp
  classesMaximized?: ClassProp

  onIdCreated?: (id: string) => void
  onOpenCreated?: (callback: DialogOpenFunction) => void
  onCloseCreated?: (callback: DialogCloseFunction) => void
  onToggleCreated?: (callback: DialogToggleFunction) => void
  onToggleMaximizeCreated?: (callback: DialogToggleMaximizedFunction) => void
  onAbsolute?: (absolute: boolean) => void
  onMaximized?: (maximized: boolean) => void

  onOpen?: VoidFunction
  onClose?: (value?: string) => void
  onCloseEnd?: VoidFunction
}

type DialogOpenFunction = (isUserEvent: boolean) => void
type DialogCloseFunction = (element?: HTMLElement) => void
type DialogToggleFunction = (isUserEvent: boolean) => void
type DialogToggleMaximizedFunction = VoidFunction

type DialogResizeDirection = 'n' | 'nw' | 'w' | 'sw' | 's' | 'se' | 'e' | 'ne'

interface DialogAttached {
  left: ASS<number | undefined>
  top: ASS<number | undefined>
  width: ASS<number | undefined>
}

interface DialogPosition {
  left: ASS<number | undefined>
  top: ASS<number | undefined>
}

interface DialogDimensions {
  width: ASS<number | undefined>
  height: ASS<number | undefined>
}

interface DialogPositionProp {
  left?: number
  top?: number
}

interface DialogDimensionsProp {
  width?: number
  height?: number
}
