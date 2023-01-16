import {
  createBLIDataFactory,
  createCharacteristicDeflectionFactory,
  createCumSumDataFactory,
  createCurvatureRadiusDataFactory,
  createHeavydynCurrentDropDataFactories,
  createHeavydynMathUnitsFromJSON,
  createHeavydynReportFromJSON,
  createHeavydynSurfaceModulusDataFactories,
  createLLIDataFactory,
  createMLIDataFactory,
  createMathNumber,
  createSelectableList,
  createWatcherHandler,
} from '/src/scripts'

import { createBaseProjectFromJSON } from '../base'

export const createHeavydynProjectFromJSON = (
  json: JSONHeavydynProjectVAny,
  map: mapboxgl.Map | null
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  const units: HeavydynMathUnits = createHeavydynMathUnitsFromJSON(
    json.distinct.units
  )

  const baseProject = createBaseProjectFromJSON(json.base, map, {
    reports: [] as HeavydynReport[],
    information: json.base.information,
    hardware: json.base.hardware,
    units,
  })

  const project: HeavydynProject = shallowReactive({
    ...baseProject,
    machine: 'Heavydyn',
    calibrations: {
      date: new Date(json.distinct.calibrations.date),
      dPlate: json.distinct.calibrations.dPlate,
      channels: json.distinct.calibrations.channels,
      sensors: json.distinct.calibrations.sensors,
    },
    correctionParameters: shallowReactive({
      load: shallowReactive({
        active: false,
        loadReferenceSource: createSelectableList(
          ['Sequence', 'Custom'] as LoadReferenceSourceList,
          {
            selected:
              json.distinct.correctionParameters.load.loadReferenceSource,
          }
        ),
        customValue: createMathNumber(
          json.distinct.correctionParameters.load.customValue,
          units.force
        ),
      }),
      temperature: shallowReactive({
        active: false,
        // Temperature from > Temperature to
        temperatureFromSource: createSelectableList(
          ['Tair', 'Tsurf', 'Tman'] as TemperatureFromSourceList,
          {
            selected:
              json.distinct.correctionParameters.temperature
                .temperatureFromSource,
          }
        ),
        average: createSelectableList(
          ['Point', 'Zone', 'Report', 'Custom'] as TemperatureAverageList,
          {
            selected: json.distinct.correctionParameters.temperature.average,
          }
        ),
        customValue: createMathNumber(
          json.distinct.correctionParameters.temperature.customValue,
          units.temperature
        ),
        temperatureTo: createMathNumber(
          json.distinct.correctionParameters.temperature.temperatureTo,
          units.temperature
        ),
        structureType: createSelectableList(
          [
            {
              name: 'Souple',
              k: 0.15,
            },
            {
              name: 'Bitumineux épais',
              k: 0.2,
            },
            {
              name: 'Mixte',
              k: 0.08,
            },
            {
              name: 'Semi-rigide',
              k: 0.04,
            },
          ] as TemperatureStructureTypeList,
          {
            selectedIndex:
              json.distinct.correctionParameters.temperature.structureType,
          }
        ),
      }),
    }),
    remove: function () {
      baseProject.remove.call(project)

      watcherHandler.clean()
    },
    toJSON: function (): JSONHeavydynProject {
      return {
        version: json.version,
        machine: 'Heavydyn',
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
          calibrations: json.distinct.calibrations,
          // correctionParameters: {},
          units: {
            deflection: this.units.deflection.toJSON(),
            distance: this.units.distance.toJSON(),
            force: this.units.force.toJSON(),
            temperature: this.units.temperature.toJSON(),
            time: this.units.time.toJSON(),
          },
          correctionParameters: {
            version: 1,
            load: {
              version: 1,
              active: this.correctionParameters.load.active,
              loadReferenceSource:
                this.correctionParameters.load.loadReferenceSource.selected ||
                'Sequence',
              customValue: this.correctionParameters.load.customValue.value,
            },
            temperature: {
              version: 1,
              active: this.correctionParameters.temperature.active,
              temperatureFromSource:
                this.correctionParameters.temperature.temperatureFromSource
                  .selected || 'Tair',
              average:
                this.correctionParameters.temperature.average.selected ||
                'Zone',
              customValue:
                this.correctionParameters.temperature.customValue.value,
              temperatureTo:
                this.correctionParameters.temperature.temperatureTo.value,
              structureType:
                this.correctionParameters.temperature.structureType.getSelectedIndex() ||
                0,
            },
          },
        },
      }
    },
  })

  project.reports.list.push(
    ...json.base.reports.list.map((report) =>
      createHeavydynReportFromJSON(report as JSONHeavydynReport, map, {
        project: project,
      })
    )
  )

  watcherHandler.add(
    watch(
      () => project.reports.list.length,
      () => {
        project.reports.list.forEach((report) => {
          const dropDataLabels = report.dataLabels.groups.list[0].choices.list
          const zoneDataLabels = report.dataLabels.groups.list[2].choices.list

          const dropDataFactories = [
            ...createHeavydynCurrentDropDataFactories(dropDataLabels, units),
            createBLIDataFactory(dropDataLabels, units),
            createMLIDataFactory(dropDataLabels, units),
            createLLIDataFactory(dropDataLabels, units),
            ...createHeavydynSurfaceModulusDataFactories(dropDataLabels, units),
            createCurvatureRadiusDataFactory(dropDataLabels, units),
            createCumSumDataFactory(dropDataLabels, units),
          ]

          // TODO: Clean dataLabels before
          dropDataLabels.push(
            ...(dropDataFactories
              .map((factory) => factory.label)
              .filter((label) => label) as DataLabel[])
          )

          const zoneCharacteristicDeflectionFactory =
            createCharacteristicDeflectionFactory(dropDataLabels, units)

          const zoneFactories = [zoneCharacteristicDeflectionFactory]

          // TODO: Clean dataLabels before
          zoneDataLabels.push(
            ...(zoneFactories
              .map((factory) => factory.label)
              .filter((label) => label) as DataLabel[])
          )

          watcherHandler.add(
            watch(
              () => report.zones.length,
              () => {
                console.log('update report.zones.length')

                report.zones.forEach((zone, index, list) => {
                  zone.data.length = 0

                  watch(
                    () => 2 * 2,
                    (mli) => {}
                  )

                  zone.points.forEach((point) => {
                    point.drops.forEach((drop, index, drops) => {
                      dropDataFactories.forEach((factory) => {
                        // TODO: Fix this (queue removed)

                        const [value, updater] = factory.createDataValueTuple()

                        if (value && updater) {
                          drop.data.push(value)

                          updater(drop.data)
                        }
                      })
                    })
                  })

                  // update zone data

                  // Deflection caracteristique
                  // Prevoir choix du numero du drop - par defaut dernier

                  const [value, updater] =
                    zoneCharacteristicDeflectionFactory.createDataValueTuple()

                  if (value && updater) {
                    zone.data.push(value)

                    watcherHandler.add(
                      watch(
                        () => zone.points.length,
                        () => {
                          console.log('update zone.points.length', zone.name)

                          updater(
                            zone.points
                              .map(
                                (point) =>
                                  (point.drops.at(-1) as HeavydynDrop).data
                              )
                              .flat()
                          )
                        },
                        {
                          immediate: true,
                        }
                      )
                    )
                  }
                })
              },
              {
                immediate: true,
              }
            )
          )
        })
      },
      {
        immediate: true,
      }
    )
  )

  project.reports.selectIndex(json.base.reports.selectedIndex)

  return project as HeavydynProject
}

const upgradeJSON = (json: JSONHeavydynProjectVAny): JSONHeavydynProject => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONHeavydynProject
  }

  return json
}
