type HeadlessDialogPropsWithHTMLAttributes = MergePropsWithHTMLProps<
  HeadlessDialogProps,
  DialogHTMLAttributes
>

type HeadlessDialogProps = HeadlessDialogPropsOnly &
  Omit<InteractiveProps, keyof HeadlessDialogPropsOnly>

interface HeadlessDialogPropsOnly {
  component?: string

  attach?: Accessor<HTMLElement>

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
  classesAttached?: ClassProp
  classesWindowed?: ClassProp

  onIdCreated?: (id: string) => void
  onOpenCreated?: (callback: DialogOpenFunction) => void
  onCloseCreated?: (callback: DialogCloseFunction) => void
  onToggleCreated?: (callback: DialogToggleFunction) => void
  onToggleMaximizeCreated?: (callback: DialogToggleMaximizedFunction) => void

  onOpen?: () => void
  onClose?: (value?: string) => void
  onCloseEnd?: () => void
}

type DialogOpenFunction = (isUserEvent: boolean) => void
type DialogCloseFunction = (element?: HTMLElement) => void
type DialogToggleFunction = (isUserEvent: boolean) => void
type DialogToggleMaximizedFunction = () => void

type DialogResizeDirection = 'n' | 'nw' | 'w' | 'sw' | 's' | 'se' | 'e' | 'ne'

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
