/* eslint-disable no-fallthrough */
import {
  createFieldFromJSON,
  createSelectableList,
  createWatcherHandler,
  debounce,
  flyToPoints,
  mapStyles,
} from '/src/scripts'

export const createBaseProjectFromJSON = <
  Report extends MachineReport,
  MathUnits extends MachineMathUnits
>(
  json: JSONBaseProjectVAny,
  map: mapboxgl.Map | null,
  parameters: {
    reports: Report[]
    information: JSONField[]
    hardware: JSONField[]
    units: MathUnits
  }
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  const settings: BaseProjectSettings = reactive({
    ...json.settings,
    arePointsLocked: true,
  })

  const project: BaseProject<Report, MathUnits> = shallowReactive({
    kind: 'Project',
    name: createFieldFromJSON({
      version: 1,
      label: 'Name',
      value: json.name,
      settings: {
        version: 1,
      },
    }),
    reports: createSelectableList(parameters.reports),
    overlays: shallowReactive([] as Overlay[]),
    units: parameters.units,
    settings,
    information: shallowReactive(
      parameters.information.map((field: JSONField) =>
        createFieldFromJSON(field)
      )
    ),
    hardware: shallowReactive(
      parameters.hardware.map((field: JSONField) => createFieldFromJSON(field))
    ),
    acquisitionParameters: json.acquisitionParameters,
    refreshLinesAndOverlays() {
      if (this.settings.arePointsLinked) {
        this.reports.list.forEach((report) => {
          report.isOnMap && report.settings.isVisible && report.line.addToMap()
        })
      }

      this.overlays.forEach((overlay) => {
        overlay.addToMap(this.settings.areOverlaysVisible)
      })
    },
    setMapStyle(styleIndex: number) {
      const oldMapStyle = map?.getStyle().sprite?.split('/').pop()
      const newMapStyle = mapStyles[styleIndex].split('/').pop()

      if (oldMapStyle === newMapStyle) {
        this.refreshLinesAndOverlays()
      } else {
        map?.setStyle(mapStyles[styleIndex])
      }
    },
    fitOnMap() {
      const points = this.reports.list
        .map((report) => report.zones.map((zone) => zone.points))
        .flat(2)

      flyToPoints(map, points)
    },
    // eslint-disable-next-line sonarjs/cognitive-complexity
    addToMap() {
      if (this.settings.map.coordinates) {
        map?.flyTo({
          center: this.settings.map.coordinates,
          zoom: this.settings.map.zoom,
          pitch: this.settings.map.pitch || 0,
          bearing: this.settings.map.rotation || 0,
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
              if (report.settings.isVisible && arePointsLinked) {
                report.line?.addToMap()
              } else {
                report.line?.remove()
              }
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
    remove() {
      this.reports.list.forEach((report) => {
        report.remove()
      })

      this.overlays.forEach((overlay) => overlay.remove())

      watcherHandler.clean()
    },
    toBaseJSON(): JSONBaseProject {
      return {
        version: json.version,
        name: this.name.value as string,
        settings: this.settings,
        acquisitionParameters: this.acquisitionParameters,
        overlays: this.overlays.map((overlay) => overlay.toJSON()),
        information: this.information.map((field) => field.toJSON()),
        hardware: this.hardware.map((field) => field.toJSON()),
        reports: this.reports.toJSON((report) => report.toJSON()),
      }
    },
  })

  return project
}

const upgradeJSON = (json: JSONBaseProjectVAny): JSONBaseProject => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
