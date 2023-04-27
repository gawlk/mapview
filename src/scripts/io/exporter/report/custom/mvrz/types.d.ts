type ExcelData = string | number | boolean | null

interface ExcelJson extends RecordAny {
  [key: string]: ExcelData | ExcelData[]
}

interface FlatDataJson {
  [key: string]: ExcelFlatData
}
