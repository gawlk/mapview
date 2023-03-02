import { LngLatBounds } from 'mapbox-gl'

import {
  createFieldFromJSON,
  createLine,
  createWatcherHandler,
  debounce,
  getIndexOfSelectedInSelectableList,
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

  // @ts-ignore
  const thresholds: Thresholds = {
    groups: parameters.thresholdsGroups,
    colors: createMutable(json.thresholds.colors),
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
    fitOnMap: function () {
      const bounds = new LngLatBounds()

      this.zones.forEach((zone) => {
        zone.points.forEach((point) => {
          if (point.settings.isVisible && point.marker) {
            bounds.extend(point.marker.getLngLat())
          }
        })
      })

      if (bounds.getCenter()) {
        map?.fitBounds(bounds, { padding: 100 })
      }
    },
    addToMap: function () {
      this.isOnMap = true

      this.zones.forEach((zone) => {
        zone.init()
      })

      setInterval(() => {
        this.settings.isVisible = !this.settings.isVisible
      }, 2000)

      watcherHandler.add(
        on(
          () => this.settings.isVisible,
          (isVisible) => {
            console.log(
              `${this.name.toString()} is${!isVisible ? ' not' : ''} visible`
            )

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
          [() => this.settings.colorization, () => this.thresholds.colors],
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
    default:
      json = json as JSONBaseReport
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
