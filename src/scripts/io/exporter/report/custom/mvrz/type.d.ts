type ExcelData = string | number | boolean | null

interface ExcelJson extends AnyJSON {
  [key: string]: ExcelData | ExcelData[]
}

interface FlatDataJson {
  [key: string]: ExcelFlatData
}
