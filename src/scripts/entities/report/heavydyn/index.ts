/* eslint-disable no-console */
import {
  createBLIDataComputer,
  createCharacteristicDeflectionComputer,
  createCumSumDataComputer,
  createCurvatureRadiusDataComputers,
  createHeavydynCurrentDeflectionDropDataComputers,
  createHeavydynCurrentLoadDataComputer,
  createHeavydynDataLabelsFromJSON,
  createHeavydynSurfaceModulusDataComputers,
  createHeavydynThresholdsGroupsFromJSON,
  createHeavydynZoneFromJSON,
  createJSONBaseZone,
  run,
  selectHeavydynGroupChoiceFromJSON,
  selectTableDataLabelsFromJSON,
  createLLIDataComputer,
  createMLIDataComputer,
} from '/src/scripts'

import {
  convertThresholdsConfigurationToJSON,
  createBaseReportFromJSON,
} from '../base'

export const createHeavydynReportFromJSON = (
  json: JSONHeavydynReport,
  map: mapboxgl.Map | null,
  parameters: {
    project: HeavydynProject
  },
) => {
  json = upgradeJSON(json)

  const baseReport = createBaseReportFromJSON(json.base, map, {
    zones: [] as HeavydynZone[],
    thresholdsGroups: createHeavydynThresholdsGroupsFromJSON(
      json.distinct.thresholds,
      parameters.project.units,
    ),
    dataLabels: createHeavydynDataLabelsFromJSON(
      json.distinct.dataLabels,
      json.base.dataLabels.table,
      parameters.project,
    ),
    platform: json.base.platform,
    information: json.base.information,
    project: parameters.project,
  })

  const report: HeavydynReport = {
    ...baseReport,
    machine: 'Heavydyn',
    async addZone() {
      const jsonZone: JSONHeavydynZone = {
        version: 1,
        base: createJSONBaseZone(this.zones().length),
        distinct: {
          version: 1,
        },
      }

      const zone = await createHeavydynZoneFromJSON(jsonZone, map, {
        report: this,
      })

      this.zones.set((l) => {
        l.push(zone)
        return l
      })
    },
    toJSON(): JSONHeavydynReport {
      const thresholdsGroups = this.thresholds.groups

      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.version,
          dataLabels: this.dataLabels.groups.toJSON((group) => group.toJSON()),
          thresholds: {
            version: 2,
            deflection: convertThresholdsConfigurationToJSON(
              thresholdsGroups.deflection,
            ),
            distance: convertThresholdsConfigurationToJSON(
              thresholdsGroups.distance,
            ),
            force: convertThresholdsConfigurationToJSON(thresholdsGroups.force),
            temperature: convertThresholdsConfigurationToJSON(
              thresholdsGroups.temperature,
            ),
            time: convertThresholdsConfigurationToJSON(thresholdsGroups.time),
            modulus: convertThresholdsConfigurationToJSON(
              thresholdsGroups.modulus,
            ),
            cumSum: convertThresholdsConfigurationToJSON(
              thresholdsGroups.cumSum,
            ),
            radius: convertThresholdsConfigurationToJSON(
              thresholdsGroups.radius,
            ),
          },
        },
      }
    },
  }

  void run(async () =>
    report.zones.set(
      await Promise.all(
        json.base.zones.map((jsonZone) =>
          createHeavydynZoneFromJSON(jsonZone, map, {
            report,
          }),
        ),
      ),
    ),
  )

  // Warning: Order matters
  // Drop computers
  createHeavydynCurrentLoadDataComputer(report)
  createHeavydynCurrentDeflectionDropDataComputers(report)
  createBLIDataComputer(report)
  createMLIDataComputer(report)
  createLLIDataComputer(report)
  createHeavydynSurfaceModulusDataComputers(report)
  createCurvatureRadiusDataComputers(report)
  createCumSumDataComputer(report)
  // Zone computers
  createCharacteristicDeflectionComputer(report)

  setTimeout(() => {
    selectHeavydynGroupChoiceFromJSON(report, json)
    selectTableDataLabelsFromJSON(report, json.base)
  }, 100)

  return report
}

const upgradeJSON = (json: JSONHeavydynReportVAny): JSONHeavydynReport => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
