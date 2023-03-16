export const convertPRJZObjectToFields = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        label: (() => {
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
        })(),
        value: value as string | number,
        settings,
      }
    })

export const convertExportedUnitToJSONDataLabel = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exportedUnit: any
): JSONDataLabel<string> => {
  const mathUnitName = String(exportedUnit.Type).toLowerCase()

  let unit = mathUnitName

  if (exportedUnit.Unit === '%') {
    unit = 'percentage'
  } else if (mathUnitName === 'number') {
    unit = exportedUnit.unit
  }

  return {
    version: 1,
    name: exportedUnit.Name,
    unit,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertPRJZToTestChoices = (json: any): JSONDataLabel<string>[] =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json.ExportedData.Points.map((exportedUnit: any) =>
    convertExportedUnitToJSONDataLabel(exportedUnit)
  )

export const convertSensorPositionToName = (position: number) =>
  `D${(position * 1000).toFixed(0)}`
