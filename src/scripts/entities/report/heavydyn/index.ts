import { createBaseReportFromJSON } from '../base'
import {
  createHeavydynPointFromJSON,
  createHeavydynFieldFromJSON,
  createSelectableList,
} from '/src/scripts'

export const createHeavydynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: HeavydynReportCreatorParameters
) => {
  const dropValuesNamesList: ValueName[] =
    json.valuesNames.groups.list
      .find((group) => group.from === 'Drop')
      ?.choices.list?.map((name) => {
        return {
          name: name,
          unit: parameters.units.deformation,
        }
      }) || []

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

  const report: PartialMachineReport<HeavydynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'heavydyn',
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
