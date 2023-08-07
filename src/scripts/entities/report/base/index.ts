import {
  createFieldFromJSON,
  createLine,
  createWatcherHandler,
  debounce,
  flyToPoints,
  getIndexOfSelectedInSelectableList,
  upgradeColorNameFromV1ToV2,
} from '/src/scripts'

export const createBaseReportFromJSON = <
  Zone extends MachineZone,
  DataLabels extends BaseDataLabels,
  ThresholdsGroups extends BaseThresholdsGroups,
  Thresholds extends BaseThresholds<ThresholdsGroups>,
  Project extends BaseProject
>(
  json: JSONBaseReport,
  map: mapboxgl.Map | null,
  parameters: {
    zones: Zone[]
    project: Project
    dataLabels: DataLabels
    platform: JSONField[]
    information: JSONField[]
    thresholdsGroups: ThresholdsGroups
  }
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  // Need to understand why the Thresholds type can't be used while BaseThresholds<ThresholdsGroups> works
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const thresholds: Thresholds = {
    groups: parameters.thresholdsGroups,
    colors: createMutable(upgradeThresholdsColorsJSON(json.thresholds.colors)),
    inputs: createMutable(json.thresholds.inputs),
  }

  const report: BaseReport<Project, Zone, DataLabels, Thresholds> = {
    kind: 'Report',
    name: createFieldFromJSON({
      version: 1,
      label: 'Name',
      value: json.name,
      settings: {
        version: 1,
      },
    }),
    isOnMap: false as boolean,
    settings: createMutable(json.settings),
    screenshots: createMutable([] as string[]),
    dataLabels: parameters.dataLabels,
    thresholds,
    zones: createMutable(parameters.zones),
    line: createLine(map),
    platform: createMutable(
      parameters.platform.map((field: JSONField) => createFieldFromJSON(field))
    ),
    information: createMutable(
      parameters.information.map((field: JSONField) =>
        createFieldFromJSON(field)
      )
    ),
    project: parameters.project,
    fitOnMap() {
      const points = this.zones.map((zone) => zone.points).flat()

      flyToPoints(map, points)
    },
    getExportablePoints() {
      return this.line.sortedPoints.filter((point) => point.settings.isVisible)
    },
    addToMap() {
      this.isOnMap = true

      this.zones.forEach((zone) => {
        zone.init()
      })

      watcherHandler.add(
        on(
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
        on(
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
        on(
          () => [
            this.dataLabels.groups.selected,
            this.dataLabels.groups.selected?.choices.selected,
            this.dataLabels.groups.selected?.from === 'Drop'
              ? this.dataLabels.groups.selected.indexes.selected
              : undefined,
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
        on(
          [
            () => this.settings.colorization,
            () => this.thresholds.colors.low,
            () => this.thresholds.colors.middle,
            () => this.thresholds.colors.high,
          ],
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
        (thresholdGroup: ThresholdsGroup<string>) => {
          watcherHandler.add(
            on(
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
    remove() {
      this.isOnMap = false

      this.zones.forEach((zone) => {
        zone.clean()
      })

      this.line.remove()

      watcherHandler.clean()
    },
    toBaseJSON(): JSONBaseReport {
      return {
        version: 1,
        name: this.name.value as string,
        dataLabels: this.dataLabels.toBaseJSON(),
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
  }

  return report
}

const upgradeJSON = (json: JSONBaseReportVAny): JSONBaseReport => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}

const upgradeThresholdsColorsJSON = (
  json: JSONThresholdColorsVAny
): JSONThresholdColors => {
  switch (json.version) {
    case 1:
      json = {
        ...json,
        version: 2,
        high: upgradeColorNameFromV1ToV2(json.high),
        middle: upgradeColorNameFromV1ToV2(json.middle),
        low: upgradeColorNameFromV1ToV2(json.low),
      }
  }

  return json
}

export const convertThresholdsConfigurationToJSON = (
  group: ThresholdsGroup<string>
): JSONDistinctThresholdsConfiguration => ({
  version: 1,
  selectedIndex: getIndexOfSelectedInSelectableList(group.choices) || 0,
  custom: (group.choices.list.slice(-1)[0] as CustomThreshold).toJSON(),
})
