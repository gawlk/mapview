import { convertSensorPositionToName } from '../shared'

export const convertPRJZToBaseDrop = (
  jsonDrop: any,
  index: number,
  json: any
): JSONBaseDrop => {
  const exportedDeflections = (json.ExportedData.Drops as any[]).find(
    (exportedData) => exportedData.Name === 'Deflections'
  )

  const drop: JSONBaseDrop = {
    version: 1,
    index,
    data: [
      ...(json.ExportedData.Drops as any[])
        .filter((exportedData) => exportedData !== exportedDeflections)
        .map((exportedData: any): JSONDataValue => {
          return {
            version: 1,
            label: exportedData.Name,
            value: jsonDrop[exportedData.Name],
          }
        }),
      ...(exportedDeflections
        ? jsonDrop.Deflections.map((value: number, index: number) => {
            return {
              label: convertSensorPositionToName(
                json.Calibrations.SensorsPosition[index]
              ),
              value,
            }
          })
        : []),
    ],
  }

  return drop
}
