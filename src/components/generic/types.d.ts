// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconProp = string | ((...args: any[]) => JSXElement) | true

type ClassProp = string | (ClassProp | string | false | undefined)[]

type StyleProp = string | CSSProperties

type MergePropsWithHTMLProps<
  T,
  HTMLAttributes extends HTMLAttributes = HTMLAttributes,
> = T & Omit<HTMLAttributes, keyof T>

type BooleanPropsKeysObject<Props> = {
  [T in keyof Required<Props>]: boolean
}

interface ValuesProps<T = ValuesListProps> {
  readonly selected: string | number | null
  readonly list: T
}

type ValuesListProps = string[] | ValueWithTextProps[]

interface ValueWithTextProps extends ButtonPropsWithHTMLAttributes {
  readonly text?: string | (() => JSXElement)
  readonly value: string
}
