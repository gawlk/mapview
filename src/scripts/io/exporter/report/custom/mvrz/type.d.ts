type ExcelData = string | number | boolean
type ExcelFlatData = string[] | number[] | boolean[]

interface ExcelJson extends AnyJSON {
  [key: string]: ExcelData | ExcelFlatData
}

interface FlatDataJson {
  [key: string]: ExcelFlatData
}
