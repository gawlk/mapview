// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordAny = Record<string, any>

type RecordBoolean = Record<string, boolean>

type BooleanPropsKeys = RecordBoolean | RecordBoolean[]

export const booleanPropsKeysToArray = (propsKeys: BooleanPropsKeys) => {
  const reducedPropsKeys = Array.isArray(propsKeys)
    ? propsKeys.reduce(
        (previous, current) => ({
          ...previous,
          ...current,
        }),
        {},
      )
    : propsKeys

  return Object.keys(reducedPropsKeys).filter((key) => reducedPropsKeys[key])
}

export const keepProps = <T extends RecordAny>(
  props: T,
  propsKeys: BooleanPropsKeys,
) => splitProps(props, booleanPropsKeysToArray(propsKeys))[0]

export const removeProps = <T extends RecordAny>(
  props: T,
  propsKeys: BooleanPropsKeys,
) => splitProps(props, booleanPropsKeysToArray(propsKeys))[1]

export const classPropToString = (classes?: ClassProp): string =>
  Array.isArray(classes)
    ? (
        classes
          .map((c) => (Array.isArray(c) ? classPropToString(c) : c))
          .filter((c) => c) as string[]
      )
        .map((c) => c.trim())
        .join(' ')
        .trim()
    : classes || ''

export const stylePropToCSSProperties = (style?: string | CSSProperties) => {
  if (!style) {
    return undefined
  }

  if (typeof style === 'object') {
    return style
  }

  const styleObject: CSSProperties = {}

  ;(style || '').replace(/([\w-]+)\s*:\s*([^;]+)/g, (_, prop, value) => {
    styleObject[prop] = value
    return ''
  })

  return styleObject
}

export const valueWithTextToJSXElement = (
  prop: ValueWithTextProps,
): (() => JSXElement) =>
  typeof prop.text === 'function'
    ? prop.text
    : () => String(prop.text ?? prop.value ?? '')

export const convertValuesPropsListToValuesWithTextProps = (
  list: ValuesListProps,
): ValueWithTextProps[] => {
  const first = list.at(0)

  if (first && typeof first !== 'string') {
    return list as (typeof first)[]
  }
  return list.map((value) => ({
    value: value as string,
  }))
}

export const isValuePropSelected = (
  selected: string | number | null,
  toCheck: ValueWithTextProps,
  toCheckIndex: number,
) =>
  (typeof selected === 'number' && selected === toCheckIndex) ||
  selected === toCheck.value ||
  selected === toCheck.text
