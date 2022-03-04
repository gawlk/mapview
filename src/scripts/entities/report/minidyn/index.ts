import { createBaseReportFromJSON } from '../base'
import {
  createMinidynPointFromJSON,
  createMinidynFieldFromJSON,
  createSelectableList,
} from '/src/scripts'

export const createMinidynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: MinidynReportCreatorParameters
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
    {
      name: 'Temperature',
      unit: parameters.units.temperature,
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

  const report: PartialMachineReport<MinidynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'minidyn',
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
      createMinidynPointFromJSON(jsonPoint, map, {
        iconName: json.settings.iconName,
        number: index + 1,
        projectSettings: parameters.projectSettings,
        reportSettings: report.settings,
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
