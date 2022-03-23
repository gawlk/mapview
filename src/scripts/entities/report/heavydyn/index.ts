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
  const jsonDropGroup = json.dataLabels.groups.list.find(
    (group) => group.from === 'Drop'
  )

  const dropDataLabelsList: DataLabel[] =
    jsonDropGroup?.choices.list?.map((name) => {
      return {
        name: name,
        unit: parameters.units.deformation,
      }
    }) || []

  const jsonDropIndexes = jsonDropGroup?.indexes?.list || []

  const groupedDataLabelsList: GroupedDataLabels[] = [
    {
      from: 'Drop',
      choices: createSelectableList(
        jsonDropGroup?.choices?.selected || null,
        dropDataLabelsList,
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
        dropDataLabelsList,
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
        dropDataLabelsList,
        {
          reactive: true,
          isSelectedAnIndex: true,
        }
      ),
    },
  ]

  const report: PartialMachineReport<HeavydynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'heavydyn',
      groupedDataLabels: createSelectableList(
        json.dataLabels.groups.selected,
        groupedDataLabelsList,
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
