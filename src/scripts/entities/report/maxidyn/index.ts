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
  const jsonDropGroup = json.valuesNames.groups.list.find(
    (group) => group.from === 'Drop'
  )

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

  const jsonDropIndexes = jsonDropGroup?.indexes?.list || []

  const groupedValuesNamesList: GroupedValuesNames[] = [
    {
      from: 'Drop',
      choices: createSelectableList(
        jsonDropGroup?.choices?.selected || null,
        dropValuesNamesList,
        {
          reactive: true,
          isSelectedAnIndex: true,
        }
      ),
      indexes: createSelectableList(
        jsonDropGroup?.indexes?.selected || null,
        jsonDropIndexes,
        {
          reactive: true,
          isSelectedAnIndex: true,
        }
      ),
    },
    {
      from: 'Test',
      choices: createSelectableList(
        jsonDropGroup?.choices?.selected || null,
        dropValuesNamesList,
        {
          reactive: true,
          isSelectedAnIndex: true,
        }
      ),
    },
    {
      from: 'Zone',
      choices: createSelectableList(
        jsonDropGroup?.choices?.selected || null,
        dropValuesNamesList,
        {
          reactive: true,
          isSelectedAnIndex: true,
        }
      ),
    },
  ]

  const report: PartialMachineReport<MaxidynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'maxidyn',
      groupedValuesNames: createSelectableList(
        json.valuesNames.groups.selected,
        groupedValuesNamesList,
        {
          reactive: true,
          isSelectedAnIndex: true,
        }
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
