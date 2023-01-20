import {
  createBLIDataComputer,
  createCharacteristicDeflectionComputer, // createCharacteristicDeflectionFactory,
  // createCumSumDataCompute,
  // createCurvatureRadiusDataCompute,
  createHeavydynCurrentDropDataComputers,
  createHeavydynDataLabelsFromJSON,
  createHeavydynSurfaceModulusDataComputers, // createHeavydynSurfaceModulusDataFactories,
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
    ...createHeavydynCurrentDropDataComputers(report), // Needs to be first
    createBLIDataComputer(report),
    createMLIDataComputer(report),
    createLLIDataComputer(report),
    ...createHeavydynSurfaceModulusDataComputers(report),
    createCharacteristicDeflectionComputer(report),
  ].forEach((computer) => computer?.init())

  // const dropDataLabels = report.dataLabels.groups.list[0].choices.list
  // const zoneDataLabels = report.dataLabels.groups.list[2].choices.list

  // const units = parameters.project.units

  // const dropDataFactories = [
  //   ...,
  //   // createBLIDataCompute(dropDataLabels, units),
  //   // createMLIDataCompute(dropDataLabels, units),
  //   // createLLIDataCompute(dropDataLabels, units),
  //   // ...createHeavydynSurfaceModulusDataFactories(dropDataLabels, units),
  //   // createCurvatureRadiusDataCompute(dropDataLabels, units),
  //   // createCumSumDataCompute(dropDataLabels, units),
  // ]

  // dropDataLabels.push(
  //   ...(dropDataFactories.filter((factory) => factory) as DataCompute[]).map(
  //     (factory) => factory.label
  //   )
  // )

  // const zoneCharacteristicDeflectionFactory =
  // createCharacteristicDeflectionFactory(dropDataLabels, units)

  // const zoneFactories = [zoneCharacteristicDeflectionFactory]

  // TODO: Clean dataLabels before
  // zoneDataLabels.push(
  //   ...(zoneFactories
  //     .map((factory) => factory.label)
  //     .filter((label) => label) as DataLabel[])
  // )

  // watcherHandler.add(
  //   watch(
  //     () => report.zones.length,
  //     () => {
  //       console.log('update report.zones.length')

  //       report.zones.forEach((zone, index, list) => {
  //         zone.data.length = 0

  //         zone.points.forEach((point) => {
  //           point.drops.forEach((drop, index, drops) => {
  //             dropDataFactories.forEach((factory) => {
  //               // TODO: Fix this (queue removed)

  //               const [value, updater] = factory.createDataValueTuple()

  //               if (value && updater) {
  //                 drop.data.push(value)

  //                 updater(drop.data)
  //               }
  //             })
  //           })
  //         })

  //         // update zone data

  //         // Deflection caracteristique
  //         // Prevoir choix du numero du drop - par defaut dernier

  //         const [value, updater] =
  //           zoneCharacteristicDeflectionFactory.createDataValueTuple()

  //         if (value && updater) {
  //           zone.data.push(value)

  //           watcherHandler.add(
  //             watch(
  //               () => zone.points.length,
  //               () => {
  //                 console.log('update zone.points.length', zone.name)

  //                 updater(
  //                   zone.points
  //                     .map((point) => (point.drops.at(-1) as HeavydynDrop).data)
  //                     .flat()
  //                 )
  //               },
  //               {
  //                 immediate: true,
  //               }
  //             )
  //           )
  //         }
  //       })
  //     },
  //     {
  //       immediate: true,
  //     }
  //   )
  // )

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
