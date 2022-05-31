import { createBaseReportFromJSON } from '../base'
import {
  createMinidynZoneFromJSON,
  createMinidynFieldFromJSON,
  createPredefinedThreshold,
  createCustomThreshold,
} from '/src/scripts'

export const createMinidynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map | null,
  parameters: MinidynReportCreatorParameters
) => {
  const report: PartialMachineReport<MinidynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'Minidyn',
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
          createPredefinedThreshold('PF3', 120000000),
          createPredefinedThreshold('PF4', 200000000),
          createCustomThreshold(0),
        ],
        stiffness: [createCustomThreshold(0)],
        deflection: [createCustomThreshold(0)],
        force: [createCustomThreshold(0)],
        temperature: [createCustomThreshold(0)],
        time: [createCustomThreshold(0)],
        percentage: [createCustomThreshold(0)],
      },
      ...parameters,
    }
  )

  report.zones.push(
    ...json.zones.map((jsonZone) =>
      createMinidynZoneFromJSON(jsonZone, map, {
        report: report as MinidynReport,
      })
    )
  )

  report.platform.push(
    ...json.platform.map((field: JSONField) =>
      createMinidynFieldFromJSON(field)
    )
  )

  report.informations.push(
    ...json.informations.map((field: JSONField) =>
      createMinidynFieldFromJSON(field)
    )
  )

  return report as MinidynReport
}
