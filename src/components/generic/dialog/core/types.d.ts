type DialogPropsWithHTMLAttributes = MergePropsWithHTMLProps<
  DialogProps,
  DialogHTMLAttributes
>

type DialogProps = DialogPropsOnly &
  HeadlessDialogProps &
  Omit<InteractiveProps, keyof DialogPropsOnly>

interface DialogPropsOnly {
  readonly closeable?: boolean
}
