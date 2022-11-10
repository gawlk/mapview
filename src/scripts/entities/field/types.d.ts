// ---
// JSON
// ---

type JSONFieldVAny = JSONField

interface JSONField {
  readonly version: 1
  readonly label: string
  readonly value: boolean | number | string
  readonly settings: JSONFieldSettings
}

interface JSONFieldSettings {
  readonly version: 1
  readonly readOnly?: true
}

// ---
// Object
// ---

interface Field {
  readonly label: string
  readonly settings: JSONFieldSettings
  value:
    | boolean
    | number
    | string
    | SlidableNumber
    | DateValue
    | LongString
    | SelectableString
  readonly getValue: () => string | number | boolean
  readonly setValue: (value: string | number) => void
  readonly toString: () => string
  readonly toJSON: () => JSONField
}

interface SlidableNumber {
  readonly kind: 'slidableNumber'
  readonly step: number
  readonly min: number
  readonly max: number
  value: number
}

interface DateValue {
  readonly kind: 'dateValue'
  value: string
}

interface LongString {
  readonly kind: 'longString'
  value: string
}

interface SelectableString {
  readonly kind: 'selectableString'
  readonly possibleValues: string[]
  value: string
}
