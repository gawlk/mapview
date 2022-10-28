import {
  createBaseReportFromJSON,
  convertDataLabelGroupsToJSON,
  convertThresholdsConfigurationToJSON,
} from '../base'
import {
  createHeavydynZoneFromJSON,
  createFieldFromJSON,
  createHeavydynDropIndexFromJSON,
  createCustomThreshold,
  createWatcherHandler,
  createSelectableList,
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
          choices: createSelectableList(
            [createCustomThreshold(json.distinct.thresholds.deflection.custom)],
            {
              selected: json.distinct.thresholds.deflection.selected,
            }
          ),
        },
        force: {
          unit: parameters.project.units.force,
          choices: createSelectableList(
            [createCustomThreshold(json.distinct.thresholds.force.custom)],
            {
              selected: json.distinct.thresholds.force.selected,
            }
          ),
        },
        temperature: {
          unit: parameters.project.units.temperature,
          choices: createSelectableList(
            [
              createCustomThreshold(
                json.distinct.thresholds.temperature.custom
              ),
            ],
            {
              selected: json.distinct.thresholds.temperature.selected,
            }
          ),
        },
        distance: {
          unit: parameters.project.units.distance,
          choices: createSelectableList(
            [createCustomThreshold(json.distinct.thresholds.distance.custom)],
            {
              selected: json.distinct.thresholds.distance.selected,
            }
          ),
        },
        time: {
          unit: parameters.project.units.time,
          choices: createSelectableList(
            [createCustomThreshold(json.distinct.thresholds.time.custom)],
            {
              selected: json.distinct.thresholds.time.selected,
            }
          ),
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
        thresholds: {
          deflection: convertThresholdsConfigurationToJSON(
            thresholdGroup.deflection.choices
          ),
          distance: convertThresholdsConfigurationToJSON(
            thresholdGroup.distance.choices
          ),
          force: convertThresholdsConfigurationToJSON(
            thresholdGroup.force.choices
          ),
          temperature: convertThresholdsConfigurationToJSON(
            thresholdGroup.temperature.choices
          ),
          time: convertThresholdsConfigurationToJSON(
            thresholdGroup.time.choices
          ),
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
