import { LngLatBounds } from 'mapbox-gl'
import { createLine, createWatcherHandler } from '/src/scripts'

interface BaseReportCreatorParameters extends MachineReportCreatorParameters {
  machine: MachineName
  createPointFromJSON: (
    json: JSONPoint,
    map: mapboxgl.Map,
    parameters: MachinePointCreatorParameters
  ) => MachinePoint
  createFieldFromJSON: (field: JSONField) => MachineField
}

export const createBaseReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: BaseReportCreatorParameters
) => {
  const watcherHandler = createWatcherHandler()

  const mapviewSettings = reactive(json.mapviewSettings)

  const points = shallowReactive(
    json.points.map((jsonPoint) => {
      const point = parameters.createPointFromJSON(jsonPoint, map, {
        iconName: json.mapviewSettings.iconName,
        number: 0,
        projectMapviewSettings: parameters.projectMapviewSettings,
        reportMapviewSettings: mapviewSettings,
      })

      return point
    })
  )

  const report: BaseReport = shallowReactive({
    machine: parameters.machine,
    name: reactive(
      parameters.createFieldFromJSON({
        name: 'Name',
        value: json.name,
      })
    ),
    isOnMap: false,
    mapviewSettings,
    screenshots: shallowReactive([] as string[]),
    points,
    line: createLine(points, map),
    // dropsSettings: reactive(json.dropsSettings),
    platform: shallowReactive(
      json.platform.map((field: JSONField) =>
        parameters.createFieldFromJSON(field)
      )
    ),
    informations: shallowReactive(
      json.informations.map((field: JSONField) =>
        parameters.createFieldFromJSON(field)
      )
    ),
    fitOnMap: function () {
      const bounds = new LngLatBounds()

      this.points.forEach((point: MachinePoint) => {
        bounds.extend(point.marker.getLngLat())
      })

      map.fitBounds(bounds, { padding: 100 })
    },
    addToMap: function () {
      console.log('report add to map')

      this.isOnMap = true

      this.points.forEach((point) => {
        point.refreshVisibility()
      })

      if (json.mapviewSettings.isVisible) {
        this.line.addToMap()
      }

      // watcherHandler.add(
      //   watch(
      //     () => this.dropsSettings.data.selected,
      //     (selectedData: number) => {
      //       this.points.forEach((point) => {
      //         point.selectedData = selectedData
      //       })
      //     },
      //     {
      //       immediate: true,
      //     }
      //   )
      // )

      watcherHandler.add(
        watch(
          () => this.mapviewSettings.isVisible,
          (isVisible: boolean) => {
            this.points.forEach((point) => {
              point.refreshVisibility()
            })

            if (
              parameters.projectMapviewSettings.arePointsLinked &&
              isVisible
            ) {
              this.line.addToMap()
            } else {
              this.line.remove()
            }
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.mapviewSettings.iconName,
          (iconName: IconName) => {
            this.points.forEach((point) => {
              point.icon.setIcon(iconName)
            })
          }
        )
      )
    },
    remove: function () {
      this.isOnMap = false

      this.points.forEach((point) => {
        point.remove()
      })

      this.line.remove()

      watcherHandler.clean()
    },
  } as BaseReport)

  return report
}
