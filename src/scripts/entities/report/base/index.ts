import { LngLatBounds } from 'mapbox-gl'

import {
  createBaseFieldFromJSON,
  createDataLabelFromJSON,
  createLine,
  createSelectableList,
  createWatcherHandler,
  getIndexOfSelectedInSelectableList,
  debounce,
} from '/src/scripts'

export const createBaseReportFromJSON = (
  json: JSONBaseReport,
  map: mapboxgl.Map | null,
  parameters: {
    machine: MachineName
    project: MachineProject
    thresholds: MachineThresholds
    jsonGroupedDataLabels: SelectableList<number, JSONMachineGroupedDataLabels>
  }
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  const zones = shallowReactive([] as MachineZone[])

  const report: BaseReport = shallowReactive({
    machine: parameters.machine,
    name: createBaseFieldFromJSON(
      {
        version: 1,
        label: 'Name',
        value: json.name,
        settings: {
          version: 1,
        },
      },
      {
        reactive: true,
      }
    ),
    isOnMap: false as boolean,
    settings: reactive(json.settings),
    screenshots: shallowReactive([] as string[]),
    dataLabels: createDataLabelsFromJSON(
      parameters.jsonGroupedDataLabels,
      json.dataLabels.table,
      parameters.project.units
    ),
    thresholds: {
      groups: Object.entries(parameters.project.units).map(
        ([key, unit]: [string, MathUnit<string>]): GroupedThresolds<string> => {
          return {
            unit,
            choices: createSelectableList(
              json.thresholds.groups[key as keyof MachineUnitsSkeleton<number>],
              parameters.thresholds[key as keyof MachineThresholds],
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
    platform: shallowReactive([] as MachineField[]),
    information: shallowReactive([] as MachineField[]),
    project: parameters.project,
    fitOnMap: function () {
      const bounds = new LngLatBounds()

      this.zones.forEach((zone) => {
        zone.points.forEach((point) => {
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
          (isVisible) => {
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
          (iconName) => {
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
    },
    remove: function () {
      this.isOnMap = false

      this.zones.forEach((zone) => {
        zone.clean()
      })

      this.line.remove()

      watcherHandler.clean()
    },
    toBaseJSON: function (): JSONBaseReport {
      return {
        version: 1,
        name: this.name.value as string,
        dataLabels: {
          version: json.dataLabels.version,
          // groups: {
          //   selected: getIndexOfSelectedInSelectableList(
          //     this.dataLabels.groups
          //   ),
          //   list: this.dataLabels.groups.list.map((group) => {
          //     return {
          //       version: 1,
          //       from: group.from,
          //       choices: {
          //         selected: getIndexOfSelectedInSelectableList(group.choices),
          //         list: group.choices.list.map((choice): JSONDataLabel => {
          //           return {
          //             version: 1,
          //             name: choice.name,
          //             unit: choice.unit.toString(),
          //           }
          //         }),
          //       },
          //       ...(group.indexes
          //         ? {
          //             indexes: {
          //               selected: getIndexOfSelectedInSelectableList(
          //                 group.indexes
          //               ),
          //               // list: group.indexes.list.map((index) => {
          //               //   return {
          //               //     version: 1,
          //               //     displayedIndex: index.displayedIndex,
          //               //     machine: index.machine,
          //               //   }
          //               // }),
          //             },
          //           }
          //         : {}),
          //     }
          //   }),
          // },
          table: {
            selected: getIndexOfSelectedInSelectableList(
              this.dataLabels
                .table as SelectableList<MachineTableDataLabelsParameters> // TODO: Remove 'as' once TS bug is solved
            ),
            list: this.dataLabels.table.list.map(
              (tableDataLabelsParameters): JSONTableDataLabelsParameters => {
                return {
                  version: 1,
                  from: tableDataLabelsParameters.group.from,
                  dataLabels: tableDataLabelsParameters.dataLabels.map(
                    (dataLabels) => dataLabels.name
                  ),
                  index: tableDataLabelsParameters.index
                    ? (
                        this.dataLabels.table.selected?.group.indexes
                          ?.list as MachineDropIndex[]
                      ).indexOf(tableDataLabelsParameters.index)
                    : undefined,
                }
              }
            ),
          },
        },
        thresholds: {
          version: 1,
          groups: (() => {
            const obj: any = {}
            report.thresholds.groups.map((group) => {
              obj[group.unit.name] =
                getIndexOfSelectedInSelectableList(group.choices) || 0
            })
            return obj
          })(),
          colors: this.thresholds.colors,
          inputs: this.thresholds.inputs,
        },
        zones: [],
        settings: this.settings,
        screenshots: [],
        platform: this.platform.map((field) => field.toJSON()),
        information: this.information.map((field) => field.toJSON()),
      }
    },
  })

  return report
}

const createDataLabelsFromJSON = (
  jsonGroupedDataLabels: SelectableList<number, JSONMachineGroupedDataLabels>,
  jsonTableDataLabels: SelectableList<number, JSONTableDataLabelsParameters>,
  units: MachineMathUnits
): MachineReportDataLabels => {
  const jsonGroupedDataLabelsList = jsonGroupedDataLabels.list

  const jsonDropGroup = jsonGroupedDataLabelsList.find(
    (group) => group.from === 'Drop'
  )

  const jsonTestGroup = jsonGroupedDataLabelsList.find(
    (group) => group.from === 'Test'
  )

  const jsonZoneGroup = jsonGroupedDataLabelsList.find(
    (group) => group.from === 'Zone'
  )

  const groupedDataLabels = createSelectableList(
    jsonGroupedDataLabels.selected,
    [
      {
        from: 'Drop',
        choices: createSelectableList(
          jsonDropGroup?.choices?.selected ?? null,
          jsonDropGroup?.choices.list.map((jsonChoice) =>
            createDataLabelFromJSON(jsonChoice, units)
          ) || [],
          {
            reactive: true,
            isSelectedAnIndex: true,
          }
        ),
        indexes: createSelectableList(
          jsonDropGroup?.indexes?.selected ?? null,
          (jsonDropGroup?.indexes?.list as
            | JSONMachineDropIndex[]
            | undefined) || [],
          {
            reactive: true,
            isSelectedAnIndex: true,
          }
        ),
      },
      {
        from: 'Test',
        choices: createSelectableList(
          jsonTestGroup?.choices?.selected ?? null,
          jsonTestGroup?.choices.list.map((jsonChoice) =>
            createDataLabelFromJSON(jsonChoice, units)
          ) || [],
          {
            reactive: true,
            isSelectedAnIndex: true,
          }
        ),
      },
      {
        from: 'Zone',
        choices: createSelectableList(
          jsonZoneGroup?.choices?.selected ?? null,
          jsonZoneGroup?.choices.list.map((jsonChoice) =>
            createDataLabelFromJSON(jsonChoice, units)
          ) || [],
          {
            reactive: true,
            isSelectedAnIndex: true,
          }
        ),
      },
    ] as MachineGroupedDataLabels[],
    {
      reactive: true,
      isSelectedAnIndex: true,
    }
  )

  const tableDataLabelsList = groupedDataLabels.list.map((group) => {
    const tableDataLabels = jsonTableDataLabels.list?.find(
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
          .filter((dataLabel) => dataLabel) as DataLabel<string>[]
      ),
    })
  })

  // TODO: Fix ts-ignores
  return {
    // @ts-ignore next-line
    groups: groupedDataLabels,
    // @ts-ignore next-line
    table: createSelectableList(
      jsonTableDataLabels.selected,
      tableDataLabelsList,
      {
        reactive: true,
        isSelectedAnIndex: true,
      }
    ),
  }
}

const upgradeJSON = (json: JSONBaseReportVAny): JSONBaseReport => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONBaseReport
  }

  return json
}
