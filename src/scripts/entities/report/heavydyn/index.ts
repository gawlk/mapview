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
  createLLIDataComputer,
  createMLIDataComputer,
  createWatcherHandler,
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
  }
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  const baseReport = createBaseReportFromJSON(json.base, map, {
    zones: [] as HeavydynZone[],
    thresholdsGroups: createHeavydynThresholdsGroupsFromJSON(
      json.distinct.thresholds,
      parameters.project.units
    ),
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
      const json: JSONHeavydynZone = {
        version: 1,
        base: createJSONBaseZone(this.zones.length),
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
            modulus: convertThresholdsConfigurationToJSON(
              thresholdGroup.modulus
            ),
          },
        },
      }
    },
    addToMap: function () {
      baseReport.addToMap.call(report)

      report.dataLabels.groups.list[0].indexes.list.forEach((dropIndex) => {
        if (typeof dropIndex.value.unit === 'object') {
          watcherHandler.add(
            watch(dropIndex.value.unit, () => {
              dropIndex.value.updateDisplayedStrings()
            })
          )
        }
      })
    },
    remove: function () {
      baseReport.remove.call(report)

      watcherHandler.clean()
    },
  })

  report.zones.push(
    ...json.base.zones.map((jsonZone) =>
      createHeavydynZoneFromJSON(jsonZone, map, {
        report: report as HeavydynReport,
      })
    )
  )

  // Warning: Order matters
  ;[
    createHeavydynCurrentLoadDataComputer(report),
    ...createHeavydynCurrentDeflectionDropDataComputers(report), // Needs to be first
    createBLIDataComputer(report),
    createMLIDataComputer(report),
    createLLIDataComputer(report),
    ...createHeavydynSurfaceModulusDataComputers(report),
    createCharacteristicDeflectionComputer(report),
    ...createCurvatureRadiusDataComputers(report),
    createCumSumDataComputer(report),
  ].forEach((computer) => computer?.init())

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
