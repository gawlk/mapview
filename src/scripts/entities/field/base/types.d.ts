interface BaseField {
  label: string
  value:
    | boolean
    | number
    | string
    | SlidableNumber
    | DateValue
    | LongString
    | SelectableString
  settings: JSONFieldSettings
  toString: () => string
  toJSON: () => JSONBaseField
}

interface JSONBaseField {
  version: 1
  label: string
  value: boolean | number | string
  settings: JSONFieldSettings
}

interface JSONFieldSettings {
  version: 1
  readOnly?: true
}

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
}
