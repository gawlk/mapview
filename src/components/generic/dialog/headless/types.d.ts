type HeadlessDialogPropsWithHTMLAttributes = MergePropsWithHTMLProps<
  HeadlessDialogProps,
  DialogHTMLAttributes
>

interface HeadlessDialogProps {
  readonly component?: string

  readonly full?: Accessor<boolean>

  readonly attach?: Accessor<HTMLElement | undefined>

  readonly title?: string

  readonly sticky?: JSXElement

  readonly form?: JSXElement
  readonly handle?: Accessor<HTMLElement | undefined>

  readonly maximized?: true
  readonly full?: true

  readonly footer?: JSXElement

  readonly moveable?: boolean
  readonly resizable?: boolean
  readonly maximizable?: boolean

  readonly position?: DialogPositionProp

  readonly dimensions?: DialogDimensionsProp

  readonly backdrop?: boolean

  readonly classes?: ClassProp
  readonly classesOpen?: ClassProp
  readonly classesMoveable?: ClassProp
  readonly classesAbsolute?: ClassProp
  readonly classesWindowed?: ClassProp
  readonly classesFixed?: ClassProp
  readonly classesMaximized?: ClassProp

  readonly onIdCreated?: (id: string) => void
  readonly onOpenCreated?: (callback: DialogOpenFunction) => void
  readonly onCloseCreated?: (callback: DialogCloseFunction) => void
  readonly onToggleCreated?: (callback: DialogToggleFunction) => void
  readonly onToggleMaximizeCreated?: (
    callback: DialogToggleMaximizedFunction,
  ) => void
  readonly onAbsolute?: (absolute: boolean) => void
  readonly onMaximized?: (maximized: boolean) => void

  readonly onOpen?: VoidFunction
  readonly onClose?: (value?: string) => void
  readonly onCloseEnd?: VoidFunction
}

type DialogOpenFunction = (isUserEvent: boolean) => void
type DialogCloseFunction = (element?: HTMLElement) => void
type DialogToggleFunction = (isUserEvent: boolean) => void
type DialogToggleMaximizedFunction = VoidFunction

type DialogResizeDirection = 'n' | 'nw' | 'w' | 'sw' | 's' | 'se' | 'e' | 'ne'

interface DialogAttached {
  readonly left: ASS<number | undefined>
  readonly top: ASS<number | undefined>
  readonly width: ASS<number | undefined>
}

interface DialogPosition {
  readonly left: ASS<number | undefined>
  readonly top: ASS<number | undefined>
}

interface DialogDimensions {
  readonly width: ASS<number | undefined>
  readonly height: ASS<number | undefined>
}

interface DialogPositionProp {
  readonly left?: number
  readonly top?: number
}

interface DialogDimensionsProp {
  readonly width?: number
  readonly height?: number
}
