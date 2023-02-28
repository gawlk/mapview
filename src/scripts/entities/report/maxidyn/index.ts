import {
  createJSONBaseZone,
  createMaxidynDataLabelsFromJSON,
  createMaxidynThresholdsGroupsFromJSON,
  createMaxidynZoneFromJSON,
  selectMaxidynGroupChoiceFromJSON,
  selectTableDataLabelsFromJSON,
} from '/src/scripts'

import {
  convertThresholdsConfigurationToJSON,
  createBaseReportFromJSON,
} from '../base'

export const createMaxidynReportFromJSON = (
  json: JSONMaxidynReport,
  map: mapboxgl.Map | null,
  parameters: {
    project: MaxidynProject
  }
) => {
  json = upgradeJSON(json)

  const baseReport = createBaseReportFromJSON(json.base, map, {
    zones: [] as MaxidynZone[],
    thresholdsGroups: createMaxidynThresholdsGroupsFromJSON(
      json.distinct.thresholds,
      parameters.project.units
    ),
    dataLabels: createMaxidynDataLabelsFromJSON(
      json.distinct.dataLabels,
      json.base.dataLabels.table,
      parameters.project
    ),
    platform: json.base.platform,
    information: json.base.information,
    project: parameters.project,
  })

  const report: MaxidynReport = createMutable({
    ...baseReport,
    machine: 'Maxidyn',
    addZone: function () {
      const json: JSONMaxidynZone = {
        version: 1,
        base: createJSONBaseZone(this.zones.length),
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
      const thresholdGroup = this.thresholds.groups

      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.version,
          dataLabels: this.dataLabels.groups.toJSON((group) => group.toJSON()),
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

  selectMaxidynGroupChoiceFromJSON(report, json)

  selectTableDataLabelsFromJSON(report, json.base)

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
