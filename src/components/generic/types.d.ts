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
  selected: string | number | null
  list: T
}

type ValuesListProps = string[] | ValueWithTextProps[]

interface ValueWithTextProps extends ButtonPropsWithHTMLAttributes {
  text?: string | (() => JSXElement)
  value: string
}
