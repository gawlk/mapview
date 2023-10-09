type DialogPropsWithHTMLAttributes = MergePropsWithHTMLProps<
  DialogProps,
  DialogHTMLAttributes
>

type DialogProps = DialogPropsOnly &
  Omit<InteractiveProps, keyof DialogPropsOnly>

interface DialogPropsOnly {
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
