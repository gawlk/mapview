type InputPropsWithHTMLAttributes = MergePropsWithHTMLProps<
  InputProps,
  Solid.JSX.InputHTMLAttributes
>

type InputProps = InputPropsOnly & InteractiveProps

interface InputPropsOnly extends SaveableProps {
  value?: string | number

  max?: number

  min?: number

  for?: string

  debounce?: number

  long?: boolean

  bind?: boolean

  onInput?: (value?: string, event?: InputEvent) => void

  ref?: (ref?: HTMLInputElement) => void
  wrapperRef?: (ref?: HTMLDivElement) => void
}
