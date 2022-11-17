import { LngLatBounds } from 'mapbox-gl'

import {
  createDataLabelFromJSON,
  createFieldFromJSON,
  createLine,
  createSelectableList,
  createWatcherHandler,
  debounce,
  getIndexOfSelectedInSelectableList,
} from '/src/scripts'

export const createBaseReportFromJSON = (
  json: JSONBaseReport,
  map: mapboxgl.Map | null,
  parameters: {
    machine: MachineName
    project: MachineProject
    jsonGroupedDataLabels: SelectableList<number, JSONMachineGroupedDataLabels>
    thresholdsGroups: MachineReportThresholdsGroups
    dropIndexes: MachineDropIndex[]
  }
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  const zones = shallowReactive([] as MachineZone[])

  const report: BaseReport = shallowReactive({
    machine: parameters.machine,
    name: createFieldFromJSON({
      version: 1,
      label: 'Name',
      value: json.name,
      settings: {
        version: 1,
      },
    }),
    isOnMap: false as boolean,
    settings: reactive(json.settings),
    screenshots: shallowReactive([] as string[]),
    dataLabels: createDataLabelsFromJSON(
      parameters.jsonGroupedDataLabels,
      json.dataLabels.table,
      parameters.project.units,
      parameters.dropIndexes
    ),
    // @ts-ignore next-line
    thresholds: {
      groups: parameters.thresholdsGroups,
      colors: shallowReactive(json.thresholds.colors),
      inputs: shallowReactive(json.thresholds.inputs),
    },
    zones,
    line: createLine(map),
    platform: shallowReactive([] as Field[]),
    information: shallowReactive([] as Field[]),
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

      Object.values(this.thresholds.groups).forEach(
        (thresholdGroup: GroupedThresolds<string>) => {
          watcherHandler.add(
            watch(
              () => [
                thresholdGroup.choices.selected,
                (thresholdGroup.choices.list.at(-1) as CustomThreshold).type,
                (thresholdGroup.choices.list.at(-1) as CustomThreshold).value,
                (thresholdGroup.choices.list.at(-1) as CustomThreshold)
                  .valueHigh,
                thresholdGroup.unit.min,
                thresholdGroup.unit.max,
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
        }
      )
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
      console.log(this.dataLabels.table.list.length)

      return {
        version: 1,
        name: this.name.value as string,
        dataLabels: {
          version: json.dataLabels.version,
          table: {
            selected: getIndexOfSelectedInSelectableList(
              this.dataLabels
                .table as SelectableList<MachineTableDataLabelsParameters>
            ),
            list: this.dataLabels.table.list.map(
              (tableDataLabelsParameters): JSONTableDataLabelsParameters => {
                return {
                  version: 1,
                  from: tableDataLabelsParameters.group.from,
                  dataLabels: tableDataLabelsParameters.dataLabels.map(
                    (dataLabels) => dataLabels.name
                  ),
                  index:
                    tableDataLabelsParameters.index &&
                    this.dataLabels.table.selected?.group.indexes
                      ? (
                          this.dataLabels.table.selected.group.indexes
                            .list as MachineDropIndex[]
                        ).indexOf(tableDataLabelsParameters.index)
                      : undefined,
                }
              }
            ),
          },
        },
        thresholds: {
          version: 1,
          colors: this.thresholds.colors,
          inputs: this.thresholds.inputs,
        },
        zones: this.zones.map((zone) => zone.toJSON()),
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
  units: MachineMathUnits,
  dropIndexes: MachineDropIndex[]
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

  // TODO: Fix crossed types
  const groupedDataLabels = createSelectableList(
    [
      {
        from: 'Drop',
        choices: createSelectableList(
          jsonDropGroup?.choices.list.map((jsonChoice) =>
            createDataLabelFromJSON(jsonChoice, units)
          ) || [],
          {
            selected: jsonDropGroup?.choices.selected,
          }
        ),
        indexes: createSelectableList(dropIndexes, {
          selected: jsonDropGroup?.indexes?.selected,
        }),
      },
      {
        from: 'Test',
        choices: createSelectableList(
          jsonTestGroup?.choices.list.map((jsonChoice) =>
            createDataLabelFromJSON(jsonChoice, units)
          ) || [],
          {
            selected: jsonTestGroup?.choices.selected,
          }
        ),
      },
      {
        from: 'Zone',
        choices: createSelectableList(
          jsonZoneGroup?.choices.list.map((jsonChoice) =>
            createDataLabelFromJSON(jsonChoice, units)
          ) || [],
          {
            selected: jsonZoneGroup?.choices.selected,
          }
        ),
      },
    ],
    {
      selected: jsonGroupedDataLabels.selected,
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
    table: createSelectableList(tableDataLabelsList, {
      selected: jsonTableDataLabels.selected,
    }),
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

export const convertDataLabelGroupsToJSON = <
  JSONGroupedDataLabels extends JSONMachineGroupedDataLabels
>(
  report: MachineReport
): SelectableList<number, JSONGroupedDataLabels> => {
  return {
    selected: getIndexOfSelectedInSelectableList(
      report.dataLabels.groups as SelectableList<MachineGroupedDataLabels>
    ),
    list: report.dataLabels.groups.list.map(
      (group): JSONMachineGroupedDataLabels => {
        return {
          version: 1,
          from: group.from,
          choices: {
            selected: getIndexOfSelectedInSelectableList(group.choices),
            // @ts-ignore next-line
            list: group.choices.list.map(
              (choice): JSONDataLabel<MachineUnitsNames> => {
                const unit = Object.entries(report.project.units).find(
                  (entry) => entry[1] === choice.unit
                )?.[0] as MachineUnitsNames

                return {
                  version: 1,
                  name: choice.name,
                  unit,
                }
              }
            ),
          },
          ...(group.indexes
            ? {
                indexes: {
                  selected: getIndexOfSelectedInSelectableList(
                    group.indexes as SelectableList<MachineDropIndex>
                  ),
                  list: group.indexes.list.map((index) => index.toJSON()),
                },
              }
            : {}),
        }
      }
    ) as JSONGroupedDataLabels[],
  }
}

export const convertThresholdsConfigurationToJSON = (
  choices: SelectableList<AnyThreshold>
): JSONDistinctThresholdsConfiguration => {
  return {
    version: 1,
    selected: getIndexOfSelectedInSelectableList(choices) || 0,
    custom: (choices.list.at(-1) as CustomThreshold).toJSON(),
  }
}
