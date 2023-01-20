import {
  createJSONBaseZone,
  createMinidynDataLabelsFromJSON,
  createMinidynThresholdsGroupsFromJSON,
  createMinidynZoneFromJSON,
} from '/src/scripts'

import {
  convertThresholdsConfigurationToJSON,
  createBaseReportFromJSON,
} from '../base'

export const createMinidynReportFromJSON = (
  json: JSONMinidynReport,
  map: mapboxgl.Map | null,
  parameters: {
    project: MinidynProject
  }
) => {
  json = upgradeJSON(json)

  const baseReport = createBaseReportFromJSON(json.base, map, {
    zones: [] as MinidynZone[],
    thresholdsGroups: createMinidynThresholdsGroupsFromJSON(
      json.distinct.thresholds,
      parameters.project.units
    ),
    dataLabels: createMinidynDataLabelsFromJSON(
      json.distinct.dataLabels,
      json.base.dataLabels.table,
      parameters.project
    ),
    platform: json.base.platform,
    information: json.base.information,
    project: parameters.project,
  })

  const report: MinidynReport = shallowReactive({
    ...baseReport,
    machine: 'Minidyn',
    addZone: function () {
      const json: JSONMinidynZone = {
        version: 1,
        base: createJSONBaseZone(this.zones.length),
        distinct: {
          version: 1,
        },
      }

      const zone = createMinidynZoneFromJSON(json, map, {
        report: this,
      })

      zone.init()

      this.zones.push(zone)
    },
    toJSON: function (): JSONMinidynReport {
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
      createMinidynZoneFromJSON(jsonZone, map, {
        report,
      })
    )
  )

  return report as MinidynReport
}

const upgradeJSON = (json: JSONMinidynReportVAny): JSONMinidynReport => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMinidynReport
  }

  return json
}
