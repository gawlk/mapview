import {
  createJSONBaseZone,
  createMinidynDataLabelsFromJSON,
  createMinidynThresholdsGroupsFromJSON,
  createMinidynZoneFromJSON,
  run,
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
  },
) => {
  json = upgradeJSON(json)

  const baseReport = createBaseReportFromJSON(json.base, map, {
    zones: [] as MinidynZone[],
    thresholdsGroups: createMinidynThresholdsGroupsFromJSON(
      json.distinct.thresholds,
      parameters.project.units,
    ),
    dataLabels: createMinidynDataLabelsFromJSON(
      json.distinct.dataLabels,
      json.base.dataLabels.table,
      parameters.project,
    ),
    platform: json.base.platform,
    information: json.base.information,
    project: parameters.project,
  })

  const report: MinidynReport = {
    ...baseReport,
    machine: 'Minidyn',
    async addZone() {
      const jsonZone: JSONMinidynZone = {
        version: 1,
        base: createJSONBaseZone(this.zones.length),
        distinct: {
          version: 1,
        },
      }

      const zone = await createMinidynZoneFromJSON(jsonZone, map, {
        report: this,
      })

      this.zones.set((l) => {
        l.push(zone)
        return l
      })
    },
    toJSON(): JSONMinidynReport {
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
          createMinidynZoneFromJSON(jsonZone, map, {
            report,
          }),
        ),
      ),
    ),
  )

  setTimeout(() => {
    selectMinidynGroupChoiceFromJSON(report, json)
    selectTableDataLabelsFromJSON(report, json.base)
  }, 100)

  return report
}

const upgradeJSON = (json: JSONMinidynReportVAny): JSONMinidynReport => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
