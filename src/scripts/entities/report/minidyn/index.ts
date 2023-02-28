import {
  createJSONBaseZone,
  createMinidynDataLabelsFromJSON,
  createMinidynThresholdsGroupsFromJSON,
  createMinidynZoneFromJSON,
  selectMinidynGroupChoiceFromJSON,
  selectTableDataLabelsFromJSON,
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

  const report: MinidynReport = createMutable({
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

  selectMinidynGroupChoiceFromJSON(report, json)

  selectTableDataLabelsFromJSON(report, json.base)

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
