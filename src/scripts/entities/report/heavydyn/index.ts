import { createBaseReportFromJSON, convertDataLabelGroupsToJSON } from '../base'
import {
  createHeavydynZoneFromJSON,
  createFieldFromJSON,
  createHeavydynDropIndexFromJSON,
  defaultThresholds,
  createWatcherHandler,
  createSelectableList,
  getIndexOfSelectedInSelectableList,
} from '/src/scripts'

interface HeavydynReportCreatorParameters
  extends MachineReportCreatorParameters {
  project: HeavydynProject
}

export const createHeavydynReportFromJSON = (
  json: JSONHeavydynReport,
  map: mapboxgl.Map | null,
  parameters: HeavydynReportCreatorParameters
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  const dropIndexes =
    json.distinct.groupedDataLabels.list
      .find((group) => group.from === 'Drop')
      ?.indexes?.list.map((jsonDropIndex) =>
        createHeavydynDropIndexFromJSON(jsonDropIndex, {
          project: parameters.project,
        })
      ) || []

  const report: PartialMachineReport<HeavydynReport> = createBaseReportFromJSON(
    json.base,
    map,
    {
      machine: 'Heavydyn',
      thresholdsGroups: {
        deflection: {
          unit: parameters.project.units.deflection,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.deflection,
          }),
        },
        force: {
          unit: parameters.project.units.force,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.force,
          }),
        },
        temperature: {
          unit: parameters.project.units.temperature,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.temperature,
          }),
        },
        distance: {
          unit: parameters.project.units.distance,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.distance,
          }),
        },
        time: {
          unit: parameters.project.units.time,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.time,
          }),
        },
      },
      jsonGroupedDataLabels: json.distinct.groupedDataLabels,
      dropIndexes,
      ...parameters,
    }
  )

  report.zones.push(
    ...json.base.zones.map((jsonZone) =>
      createHeavydynZoneFromJSON(jsonZone, map, {
        report: report as HeavydynReport,
      })
    )
  )

  report.platform.push(
    ...json.base.platform.map((field: JSONField) => createFieldFromJSON(field))
  )

  report.information.push(
    ...json.base.information.map((field: JSONField) =>
      createFieldFromJSON(field)
    )
  )

  const baseAddToMap = report.addToMap
  report.addToMap = () => {
    baseAddToMap.call(report)

    dropIndexes?.forEach((dropIndex) => {
      if (typeof dropIndex.value.unit === 'object') {
        watcherHandler.add(
          watch(dropIndex.value.unit, () => {
            dropIndex.value.updateDisplayedStrings()
          })
        )
      }
    })
  }

  const baseRemove = report.remove
  report.remove = () => {
    baseRemove.call(report)

    watcherHandler.clean()
  }

  report.toJSON = function (): JSONHeavydynReport {
    const report = this as HeavydynReport
    const thresholdGroup = this.thresholds
      .groups as HeavydynReportThresholdsGroups

    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.version,
        groupedDataLabels:
          convertDataLabelGroupsToJSON<JSONHeavydynGroupedDataLabels>(
            report as HeavydynReport
          ),
        thresholdsSelected: {
          deflection:
            getIndexOfSelectedInSelectableList(
              thresholdGroup.deflection.choices
            ) || 0,
          distance:
            getIndexOfSelectedInSelectableList(
              thresholdGroup.distance.choices
            ) || 0,
          force:
            getIndexOfSelectedInSelectableList(thresholdGroup.force.choices) ||
            0,
          temperature:
            getIndexOfSelectedInSelectableList(
              thresholdGroup.temperature.choices
            ) || 0,
          time:
            getIndexOfSelectedInSelectableList(thresholdGroup.time.choices) ||
            0,
        },
      },
    }
  }

  return report as HeavydynReport
}

const upgradeJSON = (json: JSONHeavydynReportVAny): JSONHeavydynReport => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONHeavydynReport
  }

  return json
}
