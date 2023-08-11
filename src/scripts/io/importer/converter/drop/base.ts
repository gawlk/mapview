import { convertSensorPositionToName } from '../shared'

export const convertPRJZToBaseDrop = (
  jsonDrop: RecordAny,
  index: number,
  json: JSONAny,
): JSONBaseDrop => {
  const exportedDeflections = (json.ExportedData.Drops as RecordAny[]).find(
    (exportedData) => exportedData.Name === 'Deflections',
  )

  const drop: JSONBaseDrop = {
    version: 1,
    index,
    data: [
      ...(json.ExportedData.Drops as RecordAny[])
        .filter((exportedData) => exportedData !== exportedDeflections)
        .map((exportedData: RecordAny): JSONDataValue => {
          return {
            version: 1,
            label: exportedData.Name,
            value: jsonDrop[exportedData.Name],
          }
        }),
      ...(exportedDeflections
        ? jsonDrop.Deflections.map(
            (value: number, deflectionIndex: number): JSONDataValue => {
              return {
                version: 1,
                label: convertSensorPositionToName(
                  json.Calibrations.SensorsPosition[deflectionIndex],
                ),
                value,
              }
            },
          )
        : []),
    ],
  }

  return drop
}
