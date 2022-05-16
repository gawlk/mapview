import { createBaseReportFromJSON } from '../base'
import {
  createMaxidynZoneFromJSON,
  createMaxidynFieldFromJSON,
  createPredefinedThreshold,
  createCustomThreshold,
} from '/src/scripts'

export const createMaxidynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map | null,
  parameters: MaxidynReportCreatorParameters
) => {
  const report: PartialMachineReport<MaxidynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'Maxidyn',
      thresholds: {
        modulus: [
          createPredefinedThreshold('N.S.', 0),
          createPredefinedThreshold('AR1', 20000000),
          createPredefinedThreshold('AR2', 50000000),
          createPredefinedThreshold('AR3', 120000000),
          createPredefinedThreshold('AR4', 200000000),
          createPredefinedThreshold('PF1', 20000000),
          createPredefinedThreshold('PF2', 50000000),
          createPredefinedThreshold('PF2+', 80000000),
          createPredefinedThreshold('PF4', 200000000),
          createCustomThreshold(0),
        ],
        stiffness: [createCustomThreshold(0)],
        deflection: [createCustomThreshold(0)],
        load: [createCustomThreshold(0)],
        distance: [createCustomThreshold(0)],
        time: [createCustomThreshold(0)],
      },
      ...parameters,
    }
  )

  report.zones.push(
    ...json.zones.map((jsonZone) =>
      createMaxidynZoneFromJSON(jsonZone, map, {
        report: report as MaxidynReport,
      })
    )
  )

  report.platform.push(
    ...json.platform.map((field: JSONField) =>
      createMaxidynFieldFromJSON(field)
    )
  )

  report.informations.push(
    ...json.informations.map((field: JSONField) =>
      createMaxidynFieldFromJSON(field)
    )
  )

  return report as MaxidynReport
}
