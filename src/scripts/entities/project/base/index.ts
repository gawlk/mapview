import { LngLatBounds } from 'mapbox-gl'
import {
  createFieldFromJSON,
  createSelectableList,
  createWatcherHandler,
  mapStyles,
  debounce,
  getIndexOfSelectedInSelectableList,
} from '/src/scripts'

export const createBaseProjectFromJSON = async (
  json: JSONBaseProjectVAny,
  map: mapboxgl.Map | null,
  parameters: {
    machine: MachineName
    units: MachineMathUnits
  }
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  const settings = reactive(json.settings)

  const project: BaseProject = shallowReactive({
    machine: parameters.machine,
    name: createFieldFromJSON({
      version: 1,
      label: 'Name',
      value: json.name,
      settings: {
        version: 1,
      },
    }),
    reports: createSelectableList<MachineReport>([]),
    overlays: shallowReactive([] as Overlay[]),
    units: parameters.units,
    settings,
    information: shallowReactive([] as Field[]),
    hardware: shallowReactive([] as Field[]),
    acquisitionParameters: json.acquisitionParameters,
    refreshLinesAndOverlays: function () {
      if (this.settings.arePointsLinked) {
        this.reports.list.forEach((report) => {
          report.isOnMap && report.settings.isVisible && report.line.addToMap()
        })
      }

      this.overlays.forEach((overlay) => {
        overlay.addToMap(this.settings.areOverlaysVisible)
      })
    },
    setMapStyle: function (styleIndex: number) {
      const oldMapStyle = map?.getStyle().sprite?.split('/').pop()
      const newMapStyle = mapStyles[styleIndex].split('/').pop()

      if (oldMapStyle === newMapStyle) {
        this.refreshLinesAndOverlays()
      } else {
        map?.setStyle(mapStyles[styleIndex])
      }
    },
    fitOnMap: function () {
      const bounds = new LngLatBounds()

      this.reports.list.forEach((report: MachineReport) => {
        report.zones.forEach((zone) => {
          zone.points.forEach((point: MachinePoint) => {
            if (point.settings.isVisible && point.marker) {
              bounds.extend(point.marker.getLngLat())
            }
          })
        })
      })

      map?.fitBounds(bounds, { padding: 100 })
    },
    addToMap: function () {
      if (this.settings.map.coordinates && this.settings.map.zoom) {
        map?.flyTo({
          center: this.settings.map.coordinates,
          zoom: this.settings.map.zoom,
        })
      } else {
        this.reports.selected?.fitOnMap()
      }

      this.setMapStyle(this.settings.map.styleIndex)

      this.reports.list.forEach((report) => {
        report.addToMap()
      })

      watcherHandler.add(
        watch(
          () => this.settings.arePointsVisible,
          () => {
            this.reports.list.forEach((report: MachineReport) => {
              report.zones.forEach((zone) => {
                zone.points.forEach((point) => {
                  point.updateVisibility()
                })
              })
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.arePointsLinked,
          (arePointsLinked: boolean) => {
            this.reports.list.forEach((report: MachineReport) => {
              report.settings.isVisible && arePointsLinked
                ? report.line?.addToMap()
                : report.line?.remove()
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.arePointsLocked,
          (arePointsLocked: boolean) => {
            this.reports.list.forEach((report: MachineReport) => {
              report.zones.forEach((zone) => {
                zone.points.forEach((point) => {
                  point.marker?.setDraggable(!arePointsLocked)
                })
              })
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.areOverlaysVisible,
          (areOverlaysVisible) => {
            this.overlays.forEach((overlay) => {
              map?.setPaintProperty(
                overlay.id,
                'raster-opacity',
                areOverlaysVisible ? overlay.opacity : 0
              )

              if (areOverlaysVisible) {
                if (map) {
                  overlay.markerNW.addTo(map)
                  overlay.markerSE.addTo(map)
                }
              } else {
                overlay.markerNW.remove()
                overlay.markerSE.remove()
              }
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.pointsState,
          () => {
            this.reports.list.forEach((report) => {
              report.zones.forEach((zone) => {
                zone.points.forEach((point) => {
                  point.updateText()
                })
              })
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.map.styleIndex,
          (styleIndex) => {
            this.setMapStyle(styleIndex)
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.overlays,
          (overlays, oldOverlays) => {
            overlays.forEach((overlay) => {
              if (!oldOverlays.includes(overlay)) {
                overlay.addToMap(this.settings.areOverlaysVisible)
              }
            })
          }
        )
      )

      Object.values(this.units).forEach((mathUnit) =>
        watcherHandler.add(
          watch(
            mathUnit,
            debounce(() => {
              this.reports.list.forEach((report) => {
                report.zones.forEach((zone) => {
                  zone.points.forEach((point) => {
                    const selectedReportUnit =
                      report.dataLabels.groups.selected?.choices.selected?.unit

                    let foundMatchingUnit = false

                    point.data.forEach((dataValue) => {
                      const areUnitsMatching = dataValue.label.unit === mathUnit

                      if (!foundMatchingUnit) {
                        foundMatchingUnit = areUnitsMatching
                      }

                      areUnitsMatching &&
                        dataValue.value.updateDisplayedStrings()
                    })

                    foundMatchingUnit && point.updatePopup()

                    point.drops.forEach((drop) =>
                      drop.data.forEach((dataValue) => {
                        dataValue.label.unit === mathUnit &&
                          dataValue.value.updateDisplayedStrings()
                      })
                    )

                    selectedReportUnit === mathUnit && point.updateText()
                  })
                })
              })
            })
          )
        )
      )
    },
    remove: function () {
      this.reports.list.forEach((report) => {
        report.remove()
      })

      this.overlays.forEach((overlay) => overlay.remove())

      watcherHandler.clean()
    },
    toBaseJSON: function (): JSONBaseProject {
      return {
        version: json.version,
        name: this.name.value as string,
        machine: this.machine,
        settings: this.settings,
        acquisitionParameters: this.acquisitionParameters,
        overlays: this.overlays.map((overlay) => overlay.toJSON()),
        information: this.information.map((field) => field.toJSON()),
        hardware: this.hardware.map((field) => field.toJSON()),
        reports: {
          selected: getIndexOfSelectedInSelectableList(this.reports),
          list: this.reports.list.map((report) => report.toJSON()),
        },
      }
    },
  })

  return project
}

const upgradeJSON = (json: JSONBaseProjectVAny): JSONBaseProject => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONBaseProject
  }

  return json
}
