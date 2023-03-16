import { convertSensorPositionToName } from '../shared'

export const convertPRJZToBaseDrop = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonDrop: any,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONBaseDrop => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exportedDeflections = (json.ExportedData.Drops as any[]).find(
    (exportedData) => exportedData.Name === 'Deflections'
  )

  const drop: JSONBaseDrop = {
    version: 1,
    index,
    data: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(json.ExportedData.Drops as any[])
        .filter((exportedData) => exportedData !== exportedDeflections)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((exportedData: any): JSONDataValue => {
          return {
            version: 1,
            label: exportedData.Name,
            value: jsonDrop[exportedData.Name],
          }
        }),
      ...(exportedDeflections
        ? jsonDrop.Deflections.map(
            (value: number, deflecionIndex: number): JSONDataValue => {
              return {
                version: 1,
                label: convertSensorPositionToName(
                  json.Calibrations.SensorsPosition[deflecionIndex]
                ),
                value,
              }
            }
          )
        : []),
    ],
  }

  return drop
}
