import { LngLatBounds } from 'mapbox-gl'
import { createWatcherHandler, mapStyles } from '/src/scripts'

interface BaseProjectCreatorParameters {
  machine: MachineName
  units: MathUnit[]
  createFieldFromJSON: (field: JSONField) => MachineField
  createReportFromJSON: (
    json: JSONReport,
    map: mapboxgl.Map,
    parameters: MachineReportCreatorParameters
  ) => MachineReport
}

export const createBaseProjectFromJSON = async (
  json: JSONProject,
  map: mapboxgl.Map,
  parameters: BaseProjectCreatorParameters
) => {
  const watcherHandler = createWatcherHandler()

  const mapviewSettings = reactive(json.mapviewSettings)

  const reports = shallowReactive(
    json.reports.map((report) =>
      parameters.createReportFromJSON(report, map, {
        projectMapviewSettings: mapviewSettings,
        units: parameters.units,
      })
    )
  )

  const project: BaseProject = shallowReactive({
    machine: parameters.machine,
    name: reactive(
      parameters.createFieldFromJSON({
        name: 'Name',
        value: json.name,
      })
    ),
    selectedReport: reports[json.selectedReport || 0] || null,
    reports,
    images: shallowReactive([] as Image[]),
    units: shallowReactive(parameters.units),
    mapviewSettings,
    informations: shallowReactive(
      json.informations.map((field: JSONField) =>
        parameters.createFieldFromJSON(field)
      )
    ),
    refreshLinesAndImages: function () {
      if (this.mapviewSettings.arePointsLinked) {
        this.reports.forEach((report) => {
          report.isOnMap &&
            report.mapviewSettings.isVisible &&
            report.line.addToMap()
        })
      }

      this.images.forEach((image) => {
        image.addToMap(this.mapviewSettings.areImagesVisible)
      })
    },
    setMapStyle: function (styleIndex: number) {
      const oldMapStyle = map.getStyle().sprite?.split('/').pop()
      const newMapStyle = mapStyles[styleIndex].split('/').pop()

      if (oldMapStyle === newMapStyle) {
        this.refreshLinesAndImages()
      } else {
        map.setStyle(mapStyles[styleIndex])
      }
    },
    fitOnMap: function () {
      const bounds = new LngLatBounds()

      this.reports.forEach((report: MachineReport) => {
        report.points.forEach((point: MachinePoint) => {
          bounds.extend(point.marker.getLngLat())
        })
      })

      map.fitBounds(bounds, { padding: 100 })
    },
    addToMap: function () {
      console.log('project add')

      if (
        this.mapviewSettings.map.coordinates &&
        this.mapviewSettings.map.zoom
      ) {
        map.flyTo({
          center: this.mapviewSettings.map.coordinates,
          zoom: this.mapviewSettings.map.zoom,
          essential: true,
        })
      } else {
        this.selectedReport?.fitOnMap()
      }

      this.setMapStyle(this.mapviewSettings.map.styleIndex)

      this.reports.forEach((report) => {
        report.addToMap()
      })

      watcherHandler.add(
        watch(
          () => this.mapviewSettings.arePointsVisible,
          () => {
            this.reports.forEach((report: MachineReport) => {
              report.points.forEach((point) => {
                point.refreshVisibility()
              })
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.mapviewSettings.arePointsLinked,
          (arePointsLinked: boolean) => {
            this.reports.forEach((report: MachineReport) => {
              report.mapviewSettings.isVisible && arePointsLinked
                ? report.line?.addToMap()
                : report.line?.remove()
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.mapviewSettings.arePointsLocked,
          (arePointsLocked: boolean) => {
            this.reports.forEach((report: MachineReport) => {
              report.points.forEach((point) => {
                point.marker.setDraggable(!arePointsLocked)
              })
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.mapviewSettings.areImagesVisible,
          (areImagesVisible: boolean) => {
            this.images.forEach((image: Image) => {
              map.setPaintProperty(
                image.id,
                'raster-opacity',
                areImagesVisible ? image.opacity : 0
              )

              if (areImagesVisible) {
                image.markerNW.addTo(map)
                image.markerSE.addTo(map)
              } else {
                image.markerNW.remove()
                image.markerSE.remove()
              }
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.mapviewSettings.pointsState,
          (pointsState: PointsState) => {
            this.reports.forEach((report: MachineReport) => {
              report.points.forEach((point) => {
                point.state = pointsState
              })
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.mapviewSettings.map.styleIndex,
          (styleIndex: number) => {
            this.setMapStyle(styleIndex)
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.images,
          (images, oldImages) => {
            console.log('images update', images, oldImages)

            images.forEach((image) => {
              if (!oldImages.includes(image)) {
                image.addToMap(this.mapviewSettings.areImagesVisible)
              }
            })
          }
        )
      )
    },
    remove: function () {
      this.reports.forEach((report) => {
        report.remove()
      })

      this.images.forEach((image) => image.remove())

      watcherHandler.clean()
    },
  })

  return project
}
