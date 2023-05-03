type ExcelData = string | number | boolean | null

type ExcelJSON = Record<string, ExcelData | ExcelData[]>

type FlatDataJson = Record<string, ExcelFlatData>
