type InputPropsWithHTMLAttributes = MergePropsWithHTMLProps<
  InputProps,
  InputHTMLAttributes
>

type InputProps = InputPropsOnly & InteractiveProps

interface InputPropsOnly extends SaveableProps {
  readonly value?: string | number

  readonly max?: number

  readonly min?: number

  readonly for?: string

  readonly debounce?: number

  readonly fixable?: boolean

  readonly long?: boolean

  readonly bind?: boolean

  readonly onInput?: (value?: string, event?: InputEvent) => void

  readonly ref?: (ref?: HTMLInputElement) => void
  readonly wrapperRef?: (ref?: HTMLDivElement) => void
}
