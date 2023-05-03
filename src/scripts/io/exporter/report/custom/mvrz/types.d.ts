type ExcelData = string | number | boolean | null

type ExcelDataList = ExcelData[]

type ExcelJSON = Record<string, ExcelData | ExcelDataList>

type ExcelDataListJSON = Record<string, ExcelDataList>
