export const convertPRJZObjectToFields = (
  object: RecordAny,
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
  jsonExportedUnit: RecordAny
): JSONDataLabel<string> => {
  const mathUnitName = String(jsonExportedUnit.Type).toLowerCase()

  let unit = mathUnitName

  if (jsonExportedUnit.Unit === '%') {
    unit = 'percentage'
  } else if (mathUnitName === 'number') {
    unit = jsonExportedUnit.unit as string
  }

  return {
    version: 1,
    name: jsonExportedUnit.Name as string,
    unit,
  }
}

export const convertPRJZToTestChoices = (
  json: RecordAny
): JSONDataLabel<string>[] =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  json.ExportedData.Points.map((jsonExportedUnit: RecordAny) =>
    convertExportedUnitToJSONDataLabel(jsonExportedUnit)
  )

export const convertSensorPositionToName = (position: number) =>
  `D${(position * 1000).toFixed(0)}`
