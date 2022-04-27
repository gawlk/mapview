import { createBaseReportFromJSON } from '../base'
import {
  createMinidynPointFromJSON,
  createMinidynFieldFromJSON,
  createPredefinedThreshold,
  createCustomThreshold,
} from '/src/scripts'

export const createMinidynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: MinidynReportCreatorParameters
) => {
  const report: PartialMachineReport<MinidynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'minidyn',
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
        force: [createCustomThreshold(0)],
        temperature: [createCustomThreshold(0)],
        time: [createCustomThreshold(0)],
      },
      ...parameters,
    }
  )

  report.points.push(
    ...json.points.map((jsonPoint, index) =>
      createMinidynPointFromJSON(jsonPoint, map, {
        iconName: json.settings.iconName,
        number: index + 1,
        projectSettings: parameters.projectSettings,
        reportSettings: report.settings,
        reportDataLabels: report.dataLabels,
        reportThresholds: report.thresholds,
        zone: report.zones[jsonPoint.zone],
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
