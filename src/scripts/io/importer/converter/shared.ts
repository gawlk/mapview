import { run } from '/src/scripts'

export const convertPRJZObjectToFields = (
  object: any,
  settings: JSONFieldSettings = {
    version: 1,
  }
): JSONField[] =>
  Object.entries(object)
    .filter(
      ([key]) => key !== 'Version' && key !== 'Name' && key !== 'TypeBoard'
    )
    .map(([key, value]) => {
      return {
        version: 1,
        label: run(() => {
          switch (key) {
            case 'Serial':
              return 'Serial number'
            case 'MAC':
              return 'MAC address'
            case 'LicStart':
              return 'License start'
            case 'LicEnd':
              return 'License end'
            case 'CertStart':
              return 'Certificate start'
            case 'CertEnd':
              return 'Certificate end'
            default:
              return key
          }
        }),
        value: value as string | number,
        settings,
      }
    })

export const convertExportedUnitToJSONDataLabel = (
  exportedUnit: any
): JSONDataLabel<string> => {
  const mathUnitName = String(exportedUnit.Type).toLowerCase()

  return {
    version: 1,
    name: exportedUnit.Name,
    unit:
      exportedUnit.Unit === '%'
        ? 'percentage'
        : mathUnitName === 'number'
        ? exportedUnit.Unit
        : mathUnitName,
  }
}

export const convertPRJZToTestChoices = (json: any): JSONDataLabel<string>[] =>
  json.ExportedData.Points.map((exportedUnit: any) =>
    convertExportedUnitToJSONDataLabel(exportedUnit)
  )

export const convertSensorPositionToName = (position: number) =>
  `D${(position * 1000).toFixed(0)}`
