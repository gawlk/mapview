import { shallowReactive, watch } from 'vue'

import { createWatcherHandler } from '/src/scripts'

export const createBaseProject = async (
  json: JSONProject,
  map: mapboxgl.Map,
  parameters: {
    kind: MachineName
    units: MathUnit[]
    createField: (field: JSONField) => Field
    createReport: (
      data: JSONReport,
      map: mapboxgl.Map,
      units: MathUnit[]
    ) => MachineReport
  }
) => {
  const watcherHandler = createWatcherHandler()

  const reports = shallowReactive(
    json.reports.map((report) =>
      parameters.createReport(report, map, parameters.units)
    )
  )

  const project: BaseProject = shallowReactive({
    kind: parameters.kind,
    name: json.name,
    selectedReport: reports[json.mapviewSettings.selectedReport || 0],
    reports,
    images: shallowReactive([] as Image[]),
    units: shallowReactive(parameters.units),
    database: json.database,
    mapviewSettings: shallowReactive(json.mapviewSettings),
    informations: shallowReactive(
      json.informations.map((field: JSONField) => parameters.createField(field))
    ),
    clean: function () {
      this.reports.forEach((report) => {
        report.clean()
      })
      this.images.forEach((image) => image.remove())
      watcherHandler.clean()
    },
  })

  watcherHandler.add(
    watch(
      () => project.mapviewSettings.arePointsLinked,
      (arePointsLinked: boolean) => {
        project.reports.forEach((report: MachineReport) => {
          if (report.mapviewSettings.isVisible) {
            arePointsLinked ? report.line?.addToMap() : report.line?.remove()
          }
        })
      }
    )
  )

  watcherHandler.add(
    watch(
      () => project.mapviewSettings.arePointsLocked,
      (arePointsLocked: boolean) => {
        project.reports.forEach((report: MachineReport) => {
          report.points.forEach((point) => {
            point.marker.setDraggable(!arePointsLocked)
          })
        })
      }
    )
  )

  watcherHandler.add(
    watch(
      () => project.mapviewSettings.arePointsVisible,
      (arePointsVisible: boolean) => {
        project.reports.forEach((report: MachineReport) => {
          if (report.mapviewSettings.isVisible) {
            report.points.forEach((point) => {
              if (arePointsVisible && point.isVisible) {
                point.marker.addTo(map)
              } else {
                point.marker.remove()
              }
            })
          }
        })
      }
    )
  )

  watcherHandler.add(
    watch(
      () => project.mapviewSettings.areImagesVisible,
      (areImagesVisible: boolean) => {
        project.images.forEach((image: Image) => {
          map.setPaintProperty(
            image.layerId,
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
      () => project.mapviewSettings.pointsState,
      (pointsState: PointState) => {
        project.reports.forEach((report: MachineReport) => {
          report.points.forEach((point) => {
            point.state = pointsState
          })
        })
      }
    )
  )

  return project
}
