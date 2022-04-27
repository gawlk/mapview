import { LngLatBounds } from 'mapbox-gl'
import {
  createBaseFieldFromJSON,
  createLine,
  createSelectableList,
  createWatcherHandler,
  createZone,
} from '/src/scripts'

export const createBaseReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: BaseReportCreatorParameters
) => {
  const watcherHandler = createWatcherHandler()
  const pointsWatcherHandlers = createWatcherHandler()
  const zonesWatcherHandlers = createWatcherHandler()

  const points: MachinePoint[] = shallowReactive([])

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
                jsonChoice.unit in parameters.units
                  ? parameters.units[jsonChoice.unit as keyof MachineMathUnits]
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
                jsonChoice.unit in parameters.units
                  ? parameters.units[jsonChoice.unit as keyof MachineMathUnits]
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
              unit: parameters.units[jsonChoice.unit as keyof MachineMathUnits],
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
      },
      true
    ),
    isOnMap: false as boolean,
    settings: reactive(json.settings),
    screenshots: shallowReactive([] as string[]),
    points,
    dataLabels,
    thresholds: {
      groups: Object.entries(parameters.units).map(
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
    zones: shallowReactive([
      createZone({
        name: 'Default',
        color: 'gray',
        isVisible: true,
      }),
      ...json.zones.map((zone) => createZone(zone)),
    ]),
    line: createLine(points, map),
    platform: shallowReactive([]),
    informations: shallowReactive([]),
    fitOnMap: function () {
      const bounds = new LngLatBounds()

      this.points.forEach((point: MachinePoint) => {
        if (point.settings.isVisible) {
          bounds.extend(point.marker.getLngLat())
        }
      })

      map.fitBounds(bounds, { padding: 100 })
    },
    updatePointsNumbers: function () {
      this.points
        .filter((point) => point.settings.isVisible)
        .forEach((point, index) => {
          if (point.number !== index + 1) {
            point.number = index + 1
          }
        })
    },
    addToMap: function () {
      this.isOnMap = true

      this.points.forEach((point) => {
        point.addToMap()
      })

      if (this.settings.isVisible) {
        this.line.addToMap()
      }

      watcherHandler.add(
        watch(
          () => this.settings.isVisible,
          (isVisible: boolean) => {
            this.points.forEach((point) => {
              isVisible ? point.addToMap() : point.remove()
            })

            if (parameters.projectSettings.arePointsLinked && isVisible) {
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
            this.points.forEach((point) => {
              point.icon.setIcon(iconName)
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.points.length,
          () => {
            pointsWatcherHandlers.clean()

            this.points.forEach((point) => {
              pointsWatcherHandlers.add(
                watch(
                  () => point.settings.isVisible,
                  () => {
                    point.updateVisibility()
                    this.updatePointsNumbers()
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

      watcherHandler.add(
        watch(
          () => this.zones.length,
          () => {
            zonesWatcherHandlers.clean()

            this.zones.forEach((zone) => {
              zonesWatcherHandlers.add(
                watch(
                  () => zone.color,
                  () => {
                    this.points.forEach((point) => {
                      point.zone === zone && point.updateColor()
                    })
                  }
                )
              )

              zonesWatcherHandlers.add(
                watch(
                  () => zone.isVisible,
                  () => {
                    this.points.forEach((point) => {
                      point.zone === zone && point.updateVisibility()
                      this.line.update()
                    })
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

      watcherHandler.add(
        watch(
          () => [
            this.dataLabels.groups.selected,
            this.dataLabels.groups.selected?.choices.selected,
            this.dataLabels.groups.selected?.indexes?.selected,
          ],
          () => {
            points.forEach((point) => {
              point.updateText()
              point.updateColor()
            })

            this.line.update()
          }
        )
      )

      watcherHandler.add(
        watch(
          [() => this.settings.colorization, this.thresholds.colors],
          () => {
            points.forEach((point) => {
              point.updateColor()
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
            () => {
              points.forEach((point) => {
                point.updateColor()
              })

              this.line.update()
            }
          )
        )
      })
    },
    remove: function () {
      this.isOnMap = false

      this.points.forEach((point) => {
        point.remove()
      })

      this.line.remove()

      watcherHandler.clean()
      pointsWatcherHandlers.clean()
      zonesWatcherHandlers.clean()
    },
  })

  return report
}
