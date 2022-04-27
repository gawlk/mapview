import { createBaseReportFromJSON } from '../base'
import {
  createHeavydynPointFromJSON,
  createHeavydynFieldFromJSON,
  createCustomThreshold,
} from '/src/scripts'

export const createHeavydynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: HeavydynReportCreatorParameters
) => {
  const report: PartialMachineReport<HeavydynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'heavydyn',
      thresholds: {
        deflection: [createCustomThreshold(0)],
        force: [createCustomThreshold(0)],
        temperature: [createCustomThreshold(0)],
        distance: [createCustomThreshold(0)],
        time: [createCustomThreshold(0)],
      },
      ...parameters,
    }
  )

  report.points.push(
    ...json.points.map((jsonPoint, index) =>
      createHeavydynPointFromJSON(jsonPoint, map, {
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
      createHeavydynFieldFromJSON(field)
    )
  )

  report.informations.push(
    ...json.informations.map((field: JSONField) =>
      createHeavydynFieldFromJSON(field)
    )
  )

  return report as HeavydynReport
}
