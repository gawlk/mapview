// ---
// JSON
// ---

type JSONFieldVAny = JSONField

interface JSONField {
  version: 1
  label: string
  value: boolean | number | string
  settings: JSONFieldSettings
}

interface JSONFieldSettings {
  version: 1
  readOnly?: true
}

// ---
// Object
// ---

interface Field {
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
  toJSON: () => JSONField
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
