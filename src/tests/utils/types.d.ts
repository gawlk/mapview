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
