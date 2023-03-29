type transformerDataType =
  | 'onlyValue'
  | 'onlyKey'
  | 'noTransformation'
  | 'combos'

interface combosData {
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
