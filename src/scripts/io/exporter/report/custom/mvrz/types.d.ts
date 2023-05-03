type ExcelData = string | number | boolean | null

type ExcelJSON = Record<string, ExcelData | ExcelData[]>

type ExcelFlatData = string[] | number[] | boolean[]

type FlatDataJson = Record<string, ExcelFlatData>
