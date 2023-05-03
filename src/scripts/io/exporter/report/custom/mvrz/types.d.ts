type ExcelData = string | number | boolean | null

type ExcelDataList = any

type ExcelJSON = Record<string, ExcelData | ExcelDataList>

type ExcelDataListJSON = Record<string, ExcelDataList>
