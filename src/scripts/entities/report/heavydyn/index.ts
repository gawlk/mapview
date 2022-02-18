import { createBaseReportFromJSON } from '../base'
import {
  createHeavydynPointFromJSON,
  createHeavydynFieldFromJSON,
} from '/src/scripts'

export const createHeavydynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: HeavydynReportCreatorParameters
) => {
  const units = parameters.units

  const dropList: ValueName[] =
    json.values.drop.list?.map((name) => {
      return {
        name: name,
        unit: units.deformation,
      }
    }) || []

  const report: PartialMachineReport<HeavydynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'heavydyn',
      dropList,
      pointList: [],
      zoneList: [],
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
