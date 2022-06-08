import { LngLatBounds } from 'mapbox-gl'

import {
  createBaseFieldFromJSON,
  createLine,
  createSelectableList,
  createWatcherHandler,
  debounce,
} from '/src/scripts'

export const createBaseReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map | null,
  parameters: BaseReportCreatorParameters
) => {
  const watcherHandler = createWatcherHandler()

  const zones = shallowReactive([] as MachineZone[])

  const jsonDropGroup = json.dataLabels.groups.list.find(
    (group) => group.from === 'Drop'
  )

  const jsonTestGroup = json.dataLabels.groups.list.find(
    (group) => group.from === 'Test'
  )

  const jsonZoneGroup = json.dataLabels.groups.list.find(
    (group) => group.from === 'Zone'
  )

  const groupedDataLabels = createSelectableList(
    json.dataLabels.groups.selected,
    [
      {
        from: 'Drop',
        choices: createSelectableList(
          jsonDropGroup?.choices?.selected ?? null,
          jsonDropGroup?.choices.list.map((jsonChoice) => {
            return {
              name: jsonChoice.name,
              unit:
                jsonChoice.unit in parameters.project.units
                  ? parameters.project.units[
                      jsonChoice.unit as keyof MachineMathUnits
                    ]
                  : jsonChoice.unit,
            }
          }) || [],
          {
            reactive: true,
            isSelectedAnIndex: true,
          }
        ),
        indexes: createSelectableList(
          jsonDropGroup?.indexes?.selected ?? null,
          jsonDropGroup?.indexes?.list || [],
          {
            reactive: true,
            isSelectedAnIndex: true,
          }
        ),
      },
      {
        from: 'Test',
        choices: createSelectableList(
          jsonDropGroup?.choices?.selected ?? null,
          jsonTestGroup?.choices.list.map((jsonChoice) => {
            return {
              name: jsonChoice.name,
              unit:
                jsonChoice.unit in parameters.project.units
                  ? parameters.project.units[
                      jsonChoice.unit as keyof MachineMathUnits
                    ]
                  : jsonChoice.unit,
            }
          }) || [],
          {
            reactive: true,
            isSelectedAnIndex: true,
          }
        ),
      },
      {
        from: 'Zone',
        choices: createSelectableList(
          jsonDropGroup?.choices?.selected ?? null,
          jsonZoneGroup?.choices.list.map((jsonChoice) => {
            return {
              name: jsonChoice.name,
              unit: parameters.project.units[
                jsonChoice.unit as keyof MachineMathUnits
              ],
            }
          }) || [],
          {
            reactive: true,
            isSelectedAnIndex: true,
          }
        ),
      },
    ] as GroupedDataLabels[],
    {
      reactive: true,
      isSelectedAnIndex: true,
    }
  )

  const tableDataLabelsList: TableDataLabelsParameters[] =
    groupedDataLabels.list.map((group) => {
      const tableDataLabels = json.dataLabels.table.list?.find(
        (tableDataLabels) => tableDataLabels.from === group.from
      )

      return shallowReactive({
        group,
        index: group.indexes?.list[tableDataLabels?.index || 0],
        dataLabels: shallowReactive(
          (tableDataLabels?.dataLabels || [])
            .map((name) =>
              group.choices.list.find((choice) => choice.name === name)
            )
            .filter((dataLabel) => dataLabel) as DataLabel[]
        ),
      })
    })

  const dataLabels: ReportDataLabels = {
    groups: groupedDataLabels,
    table: createSelectableList(
      json.dataLabels.table.selected,
      tableDataLabelsList,
      {
        reactive: true,
        isSelectedAnIndex: true,
      }
    ),
  }

  const report: BaseReport = shallowReactive({
    machine: parameters.machine,
    name: createBaseFieldFromJSON(
      {
        label: 'Name',
        value: json.name,
        settings: {},
      },
      {
        reactive: true,
      }
    ),
    isOnMap: false as boolean,
    settings: reactive(json.settings),
    screenshots: shallowReactive([] as string[]),
    dataLabels,
    thresholds: {
      groups: Object.entries(parameters.project.units).map(
        ([key, unit]: [string, MathUnit]): GroupedThresolds => {
          return {
            unit,
            choices: createSelectableList(
              (json.thresholds.groups as any)[key] as number,
              (parameters.thresholds as any)[key] as AnyThreshold[],
              {
                reactive: true,
                isSelectedAnIndex: true,
              }
            ),
          }
        }
      ),
      colors: shallowReactive(json.thresholds.colors),
      inputs: shallowReactive(json.thresholds.inputs),
    },
    zones,
    line: createLine(map),
    platform: shallowReactive([]),
    informations: shallowReactive([]),
    project: parameters.project,
    fitOnMap: function () {
      const bounds = new LngLatBounds()

      this.zones.forEach((zone) => {
        zone.points.forEach((point: MachinePoint) => {
          if (point.settings.isVisible && point.marker) {
            bounds.extend(point.marker.getLngLat())
          }
        })
      })

      map?.fitBounds(bounds, { padding: 100 })
    },
    addToMap: function () {
      this.isOnMap = true

      this.zones.forEach((zone) => {
        zone.init()
      })

      if (this.settings.isVisible && this.project.settings.arePointsLinked) {
        this.line.addToMap()
      }

      watcherHandler.add(
        watch(
          () => this.settings.isVisible,
          (isVisible: boolean) => {
            this.zones.forEach((zone) => {
              zone.points.forEach((point) => {
                point.updateVisibility()
              })
            })

            if (parameters.project.settings.arePointsLinked && isVisible) {
              this.line.addToMap()
            } else {
              this.line.remove()
            }
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.iconName,
          (iconName: IconName) => {
            this.zones.forEach((zone) => {
              zone.points.forEach((point) => {
                point.icon?.setIcon(iconName)

                point.updateColor()
              })
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => [
            this.dataLabels.groups.selected,
            this.dataLabels.groups.selected?.choices.selected,
            this.dataLabels.groups.selected?.indexes?.selected,
          ],
          () => {
            this.zones.forEach((zone) => {
              zone.points.forEach((point) => {
                point.updateText()
                point.updateColor()
              })
            })

            this.line.update()
          }
        )
      )

      watcherHandler.add(
        watch(
          [() => this.settings.colorization, this.thresholds.colors],
          () => {
            this.zones.forEach((zone) => {
              zone.points.forEach((point) => {
                point.updateColor()
              })
            })

            this.line.update()
          }
        )
      )

      this.thresholds.groups.forEach((thresholdGroup) => {
        watcherHandler.add(
          watch(
            () => [
              thresholdGroup.choices.selected,
              (thresholdGroup.choices.list.at(-1) as CustomThreshold).type,
              (thresholdGroup.choices.list.at(-1) as CustomThreshold).value,
              (thresholdGroup.choices.list.at(-1) as CustomThreshold).valueHigh,
            ],
            debounce(() => {
              this.zones.forEach((zone) => {
                zone.points.forEach((point) => {
                  point.updateColor()
                })
              })

              this.line.update()
            })
          )
        )
      })

      parameters.addToMap?.()
    },
    remove: function () {
      this.isOnMap = false

      this.zones.forEach((zone) => {
        zone.clean()
      })

      this.line.remove()

      watcherHandler.clean()

      parameters.remove?.()
    },
  })

  return report
}
