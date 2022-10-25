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
  readonly toString: () => string
  readonly toJSON: () => JSONField
}

interface SlidableNumber {
  readonly kind: 'SlidableNumber'
  readonly step: number
  readonly min: number
  readonly max: number
  value: number
}

interface DateValue {
  readonly kind: 'DateValue'
  value: string
}

interface LongString {
  readonly kind: 'LongString'
  value: string
}

interface SelectableString {
  readonly kind: 'SelectableString'
  readonly possibleValues: string[]
  value: string
}
