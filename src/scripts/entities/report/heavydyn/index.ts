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
  console.time('import: report')

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
  console.timeLog('import: report')

  console.time('import: zones')
  report.zones.push(
    ...json.base.zones.map((jsonZone) =>
      createHeavydynZoneFromJSON(jsonZone, map, {
        report: report as HeavydynReport,
      })
    )
  )
  console.timeEnd('import: zones')

  console.time('import: computers')
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

  report.dataLabels.table.list.forEach((parameters) => {
    const { group } = parameters

    const tableDataLabels = json.base.dataLabels.table.list.find(
      (tableDataLabels) => tableDataLabels.from === group.from
    )

    parameters.dataLabels.push(
      ...((tableDataLabels?.dataLabels || [])
        .map((dataLabel) =>
          group.choices.list.find(
            (choice) =>
              choice.name === dataLabel.name &&
              choice.category.name === dataLabel.category
          )
        )
        .filter((dataLabel) => dataLabel) as DataLabel<string>[])
    )
  })

  console.timeEnd('import: computers')

  console.timeEnd('import: report')

  return report
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
