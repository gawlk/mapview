import {
  createJSONBaseZone,
  createMaxidynDataLabelsFromJSON,
  createMaxidynThresholdsGroupsFromJSON,
  createMaxidynZoneFromJSON,
  run,
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
  },
) => {
  json = upgradeJSON(json)

  const baseReport = createBaseReportFromJSON(json.base, map, {
    zones: [] as MaxidynZone[],
    thresholdsGroups: createMaxidynThresholdsGroupsFromJSON(
      json.distinct.thresholds,
      parameters.project.units,
    ),
    dataLabels: createMaxidynDataLabelsFromJSON(
      json.distinct.dataLabels,
      json.base.dataLabels.table,
      parameters.project,
    ),
    platform: json.base.platform,
    information: json.base.information,
    project: parameters.project,
  })

  const report: MaxidynReport = {
    ...baseReport,
    machine: 'Maxidyn',
    async addZone() {
      const jsonZone: JSONMaxidynZone = {
        version: 1,
        base: createJSONBaseZone(this.zones.length),
        distinct: {
          version: 1,
        },
      }

      const zone = await createMaxidynZoneFromJSON(jsonZone, map, {
        report: this,
      })

      this.zones.set((l) => {
        l.push(zone)
        return l
      })
    },
    toJSON(): JSONMaxidynReport {
      const thresholdsGroups = this.thresholds.groups

      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.version,
          dataLabels: this.dataLabels.groups.toJSON((group) => group.toJSON()),
          thresholds: {
            version: 1,
            deflection: convertThresholdsConfigurationToJSON(
              thresholdsGroups.deflection,
            ),
            force: convertThresholdsConfigurationToJSON(thresholdsGroups.force),
            distance: convertThresholdsConfigurationToJSON(
              thresholdsGroups.distance,
            ),
            modulus: convertThresholdsConfigurationToJSON(
              thresholdsGroups.modulus,
            ),
            percentage: convertThresholdsConfigurationToJSON(
              thresholdsGroups.percentage,
            ),
            stiffness: convertThresholdsConfigurationToJSON(
              thresholdsGroups.stiffness,
            ),
            time: convertThresholdsConfigurationToJSON(thresholdsGroups.time),
          },
        },
      }
    },
  }

  void run(async () =>
    report.zones.set(
      await Promise.all(
        json.base.zones.map((jsonZone) =>
          createMaxidynZoneFromJSON(jsonZone, map, {
            report,
          }),
        ),
      ),
    ),
  )

  setTimeout(() => {
    selectMaxidynGroupChoiceFromJSON(report, json)
    selectTableDataLabelsFromJSON(report, json.base)
  }, 100)

  return report
}

const upgradeJSON = (json: JSONMaxidynReportVAny): JSONMaxidynReport => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
