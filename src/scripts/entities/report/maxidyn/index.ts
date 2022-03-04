import { createBaseReportFromJSON } from '../base'
import {
  createMaxidynPointFromJSON,
  createMaxidynFieldFromJSON,
  createSelectableList,
} from '/src/scripts'

export const createMaxidynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: MaxidynReportCreatorParameters
) => {
  const dropValuesNamesList: ValueName[] = [
    {
      name: 'Modulus',
      unit: parameters.units.modulus,
    },
    {
      name: 'Deformation',
      unit: parameters.units.deformation,
    },
    {
      name: 'Force',
      unit: parameters.units.force,
    },
  ]

  const groupedValuesNamesList: GroupedValuesNames[] = [
    {
      from: 'Drop',
      choices: createSelectableList(
        dropValuesNamesList[0] || null,
        dropValuesNamesList,
        true
      ),
      indexes: createSelectableList(0, [0, 1, 2, 3], true),
    },
    {
      from: 'Test',
      choices: createSelectableList(
        dropValuesNamesList[0] || null,
        dropValuesNamesList,
        true
      ),
    },
    {
      from: 'Zone',
      choices: createSelectableList(
        dropValuesNamesList[0] || null,
        dropValuesNamesList,
        true
      ),
    },
  ]

  const report: PartialMachineReport<MaxidynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'maxidyn',
      groupedValuesNames: createSelectableList(
        groupedValuesNamesList[0],
        groupedValuesNamesList,
        true
      ),
      ...parameters,
    }
  )

  report.points.push(
    ...json.points.map((jsonPoint, index) =>
      createMaxidynPointFromJSON(jsonPoint, map, {
        iconName: json.settings.iconName,
        number: index + 1,
        projectSettings: parameters.projectSettings,
        reportSettings: report.settings,
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
