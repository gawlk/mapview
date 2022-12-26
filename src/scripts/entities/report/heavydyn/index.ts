import {
  colorsClasses,
  createCustomThreshold,
  createHeavydynDataLabelsFromJSON,
  createHeavydynZoneFromJSON,
  createSelectableList,
  createWatcherHandler,
} from '/src/scripts'

import {
  convertThresholdsConfigurationToJSON,
  createBaseReportFromJSON,
} from '../base'

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

  const thresholdsGroups: HeavydynThresholdsGroups = {
    deflection: {
      unit: parameters.project.units.deflection,
      choices: createSelectableList(
        [
          createCustomThreshold(json.distinct.thresholds.deflection.custom),
        ] as ThresoldsList,
        {
          selectedIndex: json.distinct.thresholds.deflection.selectedIndex,
        }
      ),
    },
    force: {
      unit: parameters.project.units.force,
      choices: createSelectableList(
        [
          createCustomThreshold(json.distinct.thresholds.force.custom),
        ] as ThresoldsList,
        {
          selectedIndex: json.distinct.thresholds.force.selectedIndex,
        }
      ),
    },
    temperature: {
      unit: parameters.project.units.temperature,
      choices: createSelectableList(
        [
          createCustomThreshold(json.distinct.thresholds.temperature.custom),
        ] as ThresoldsList,
        {
          selectedIndex: json.distinct.thresholds.temperature.selectedIndex,
        }
      ),
    },
    distance: {
      unit: parameters.project.units.distance,
      choices: createSelectableList(
        [
          createCustomThreshold(json.distinct.thresholds.distance.custom),
        ] as ThresoldsList,
        {
          selectedIndex: json.distinct.thresholds.distance.selectedIndex,
        }
      ),
    },
    time: {
      unit: parameters.project.units.time,
      choices: createSelectableList(
        [
          createCustomThreshold(json.distinct.thresholds.time.custom),
        ] as ThresoldsList,
        {
          selectedIndex: json.distinct.thresholds.time.selectedIndex,
        }
      ),
    },
  }

  const baseReport = createBaseReportFromJSON(json.base, map, {
    zones: [] as HeavydynZone[],
    thresholdsGroups,
    dataLabels: createHeavydynDataLabelsFromJSON(
      json.distinct.dataLabels,
      json.base.dataLabels.table,
      parameters.project
    ),
    platform: json.base.platform,
    information: json.base.information,
    project: parameters.project,
  })

  const report: HeavydynReport = shallowReactive({
    ...baseReport,
    machine: 'Heavydyn',
    addZone: function () {
      const colorNames = Object.keys(colorsClasses)

      const json: JSONHeavydynZone = {
        version: 1,
        base: {
          version: 1,
          name: `Zone ${this.zones.length + 1}`,
          settings: {
            version: 1,
            color: colorNames[
              Math.floor(Math.random() * colorNames.length)
            ] as ColorName,
            isVisible: true,
          },
          points: [],
        },
        distinct: {
          version: 1,
        },
      }

      const zone = createHeavydynZoneFromJSON(json, map, {
        report: this,
      })

      zone.init()

      this.zones.push(zone)
    },
    toJSON: function (): JSONHeavydynReport {
      const report = this as HeavydynReport

      const thresholdGroup = report.thresholds.groups

      return {
        version: json.version,
        base: report.toBaseJSON(),
        distinct: {
          version: json.version,
          dataLabels: report.dataLabels.groups.toJSON((group) =>
            group.toJSON()
          ),
          thresholds: {
            deflection: convertThresholdsConfigurationToJSON(
              thresholdGroup.deflection
            ),
            distance: convertThresholdsConfigurationToJSON(
              thresholdGroup.distance
            ),
            force: convertThresholdsConfigurationToJSON(thresholdGroup.force),
            temperature: convertThresholdsConfigurationToJSON(
              thresholdGroup.temperature
            ),
            time: convertThresholdsConfigurationToJSON(thresholdGroup.time),
          },
        },
      }
    },
  })

  report.zones.push(
    ...json.base.zones.map((jsonZone) =>
      createHeavydynZoneFromJSON(jsonZone, map, {
        report: report as HeavydynReport,
      })
    )
  )

  const baseAddToMap = report.addToMap
  report.addToMap = () => {
    baseAddToMap.call(report)

    report.dataLabels.groups.list[0].indexes.list.forEach((dropIndex) => {
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
