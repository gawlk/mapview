interface Field {
  name: string
  value: AnyType
}

type AnyType =
  | boolean
  | number
  | string
  | SlidableNumber
  | DateValue
  | LongString
  | SelectableString

interface SlidableNumber {
  kind: 'slidableNumber'
  value: number
  step: number
  min: number
  max: number
}

interface DateValue {
  kind: 'date'
  value: string
}

interface LongString {
  kind: 'longString'
  value: string
}

interface SelectableString {
  kind: 'selectableString'
  value: string
  possibleValues: string[]
  strict: boolean
}
