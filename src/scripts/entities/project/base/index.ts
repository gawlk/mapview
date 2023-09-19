import { $TRACK } from 'solid-js'

import {
  createFieldFromJSON,
  createSelectableList,
  createWatcherHandler,
  flyToPoints,
  mapStyles,
} from '/src/scripts'

export const createBaseProjectFromJSON = <
  Report extends MachineReport,
  MathUnits extends MachineMathUnits,
>(
  json: JSONBaseProjectVAny,
  map: mapboxgl.Map | null,
  parameters: {
    reports: Report[]
    information: JSONField[]
    hardware: JSONField[]
    units: MathUnits
  },
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  const settings = createMutable<BaseProjectSettings>({
    ...json.settings,
    arePointsLocked: true,
  })

  return createMutable<BaseProject<Report, MathUnits>>({
    kind: 'Project',
    name: createFieldFromJSON({
      version: 1,
      label: 'Name',
      value: json.name,
      settings: {
        version: 1,
      },
    }),
    state: 'Loading',
    reports: createSelectableList(parameters.reports),
    overlays: createMutable([] as Overlay[]),
    units: parameters.units,
    settings,
    information: createMutable(
      parameters.information.map((field: JSONField) =>
        createFieldFromJSON(field),
      ),
    ),
    hardware: createMutable(
      parameters.hardware.map((field: JSONField) => createFieldFromJSON(field)),
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

      if (oldMapStyle !== newMapStyle) {
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
      const flyTo = () => {
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
      }

      flyTo()

      this.reports.list.forEach((report) => {
        report.addToMap()
      })

      void watcherHandler.add(
        on(
          () => this.settings.arePointsVisible,
          () => {
            this.reports.list.forEach((report: MachineReport) => {
              report.zones.forEach((zone) => {
                zone.points.forEach((point) => {
                  point.updateVisibility()
                })
              })
            })
          },
        ),
      )

      void watcherHandler.add(
        on(
          () => this.settings.arePointsLinked,
          (arePointsLinked: boolean) => {
            this.reports.list.forEach((report: MachineReport) => {
              if (report.settings.isVisible && arePointsLinked) {
                report.line?.addToMap()
              } else {
                report.line?.remove()
              }
            })
          },
        ),
      )

      void watcherHandler.add(
        on(
          () => this.settings.arePointsLocked,
          (arePointsLocked: boolean) => {
            this.reports.list.forEach((report: MachineReport) => {
              report.zones.forEach((zone) => {
                zone.points.forEach((point) => {
                  point.marker?.setDraggable(!arePointsLocked)
                })
              })
            })
          },
        ),
      )

      void watcherHandler.add(
        on(
          () => this.settings.areOverlaysVisible,
          (areOverlaysVisible) => {
            this.overlays.forEach((overlay) => {
              const hasLayer = map?.getLayer(overlay.id)

              if (hasLayer) {
                map?.setPaintProperty(
                  overlay.id,
                  'raster-opacity',
                  areOverlaysVisible ? overlay.opacity : 0,
                )
              }

              if (areOverlaysVisible) {
                if (map) {
                  overlay.markerNW?.addTo(map)
                  overlay.markerSE?.addTo(map)
                }
              } else {
                overlay.markerNW?.remove()
                overlay.markerSE?.remove()
              }
            })
          },
        ),
      )

      void watcherHandler.add(
        on(
          () => this.settings.pointsState,
          () => {
            this.reports.list.forEach((report) => {
              report.zones.forEach((zone) => {
                zone.points.forEach((point) => {
                  void point.updateText()
                })
              })
            })
          },
        ),
      )

      void watcherHandler.add(
        on(
          () => this.settings.map.styleIndex,
          (styleIndex) => {
            this.setMapStyle(styleIndex)
          },
        ),
      )

      void watcherHandler.add(
        on(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // $TRACK is used here to watch pushes without watching the underlying children of the array
          () => this.overlays[$TRACK] as Overlay[],
          (overlays, oldOverlays) => {
            overlays.forEach((overlay) => {
              if (!oldOverlays?.includes(overlay)) {
                overlay.addToMap(this.settings.areOverlaysVisible)
              }
            })
          },
        ),
      )

      Object.values(this.units).forEach((mathUnit: MathUnit<string>) => {
        void watcherHandler.add(
          on(
            () => [mathUnit, mathUnit.currentPrecision, mathUnit.currentUnit],
            () => {
              this.reports.list.forEach((report) => {
                report.zones.forEach((zone) => {
                  zone.points.forEach((point) => {
                    const selectedReportUnit =
                      report.dataLabels.groups.selected?.choices.selected?.unit

                    point.data.forEach((dataValue) => {
                      const areUnitsMatching =
                        dataValue.label.unit.name === mathUnit.name

                      areUnitsMatching &&
                        dataValue.value.updateDisplayedStrings()
                    })

                    point.drops.forEach((drop) =>
                      drop.data.forEach((dataValue) => {
                        dataValue.label.unit.name === mathUnit.name &&
                          dataValue.value.updateDisplayedStrings()
                      }),
                    )

                    if (selectedReportUnit === mathUnit) {
                      void point.updateText()
                      point.updateColor()
                    }
                  })
                })
              })
            },
          ),
        )
      })
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
}

const upgradeJSON = (json: JSONBaseProjectVAny): JSONBaseProject => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
