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
    {
      name: 'Temperature',
      unit: parameters.units.temperature,
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

  const report: PartialMachineReport<MinidynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'minidyn',
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
