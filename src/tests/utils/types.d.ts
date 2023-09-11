interface KeyValueData {
  key: string
  value: string
}

interface FileTransformerOpt {
  removeBlankLine?: boolean
  dataType?: transformerDataType
}

interface ParsedDate {
  date: Date
  origin: string
}

type CheckDataConformityMessage =
  | 'dataType differ'
  | 'invalid Number'
  | 'invalid Date'
  | 'invalid date format'
  | 'array data invalid'
  | 'valid data'
  | 'object data differ'
  | 'object data invalid'
  | 'invalid data'
