import {
  colorsClasses,
  createCustomThreshold,
  createMaxidynDataLabelsFromJSON,
  createMaxidynZoneFromJSON,
  createSelectableList,
  defaultThresholds,
} from '/src/scripts'

import {
  convertThresholdsConfigurationToJSON,
  createBaseReportFromJSON,
} from '../base'

interface MaxidynReportCreatorParameters
  extends MachineReportCreatorParameters {
  project: MaxidynProject
}

export const createMaxidynReportFromJSON = (
  json: JSONMaxidynReport,
  map: mapboxgl.Map | null,
  parameters: MaxidynReportCreatorParameters
) => {
  json = upgradeJSON(json)

  const thresholdsGroups: MaxidynThresholdsGroups = {
    modulus: {
      unit: parameters.project.units.modulus,
      choices: createSelectableList(
        [
          defaultThresholds.ns,
          defaultThresholds.ar1,
          defaultThresholds.ar2,
          defaultThresholds.ar3,
          defaultThresholds.ar4,
          defaultThresholds.pf1,
          defaultThresholds.pf2,
          defaultThresholds['pf2+'],
          defaultThresholds.pf3,
          defaultThresholds.pf4,
          createCustomThreshold(json.distinct.thresholds.modulus.custom),
        ] as ThresoldsList,
        {
          selectedIndex: json.distinct.thresholds.modulus.selectedIndex,
        }
      ),
    },
    stiffness: {
      unit: parameters.project.units.stiffness,
      choices: createSelectableList(
        [
          createCustomThreshold(json.distinct.thresholds.stiffness.custom),
        ] as ThresoldsList,
        {
          selectedIndex: json.distinct.thresholds.stiffness.selectedIndex,
        }
      ),
    },
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
    percentage: {
      unit: parameters.project.units.percentage,
      choices: createSelectableList(
        [
          createCustomThreshold(json.distinct.thresholds.percentage.custom),
        ] as ThresoldsList,
        {
          selectedIndex: json.distinct.thresholds.percentage.selectedIndex,
        }
      ),
    },
  }

  const baseReport = createBaseReportFromJSON(json.base, map, {
    zones: [] as MaxidynZone[],
    thresholdsGroups,
    dataLabels: createMaxidynDataLabelsFromJSON(
      json.distinct.dataLabels,
      json.base.dataLabels.table,
      parameters.project
    ),
    platform: json.base.platform,
    information: json.base.information,
    project: parameters.project,
  })

  const report: MaxidynReport = shallowReactive({
    ...baseReport,
    machine: 'Maxidyn',
    addZone: function () {
      const colorNames = Object.keys(colorsClasses)

      const json: JSONMaxidynZone = {
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

      const zone = createMaxidynZoneFromJSON(json, map, {
        report: this,
      })

      zone.init()

      this.zones.push(zone)
    },
    toJSON: function (): JSONMaxidynReport {
      const report = this as MaxidynReport

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
            modulus: convertThresholdsConfigurationToJSON(
              thresholdGroup.modulus
            ),
            percentage: convertThresholdsConfigurationToJSON(
              thresholdGroup.percentage
            ),
            stiffness: convertThresholdsConfigurationToJSON(
              thresholdGroup.stiffness
            ),
            time: convertThresholdsConfigurationToJSON(thresholdGroup.time),
          },
        },
      }
    },
  })

  report.zones.push(
    ...json.base.zones.map((jsonZone) =>
      createMaxidynZoneFromJSON(jsonZone, map, {
        report,
      })
    )
  )

  return report as MaxidynReport
}

const upgradeJSON = (json: JSONMaxidynReportVAny): JSONMaxidynReport => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMaxidynReport
  }

  return json
}
