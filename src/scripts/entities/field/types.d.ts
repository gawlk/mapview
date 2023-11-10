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
  readonly readOnly?: boolean
}

// ---
// Object
// ---

interface Field {
  readonly label: string
  readonly settings: FieldSettings
  readonly value: ASS<
    | boolean
    | number
    | string
    | SlidableNumber
    | DateValue
    | LongString
    | SelectableString
  >
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
  readonly value: ASS<number>
}

interface DateValue {
  readonly kind: 'dateValue'
  readonly value: ASS<string>
}

interface LongString {
  readonly kind: 'longString'
  readonly value: ASS<string>
}

interface SelectableString {
  readonly kind: 'selectableString'
  readonly possibleValues: string[]
  readonly value: ASS<string>
}

interface FieldSettings extends SerializableObject<JSONFieldSettings> {
  readonly readOnly: ASS<boolean>
}
