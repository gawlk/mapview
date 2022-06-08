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
  settings: FieldSettings
  convertValueToString: () => string
}

interface JSONField {
  label: string
  value: boolean | number | string
  settings: FieldSettings
}

interface FieldSettings {
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
