import { reactive, shallowReactive, watch } from 'vue'

import { createLine, createWatcherHandler } from '/src/scripts'

export const createBaseReport = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: {
    kind: MachineName
    units: MathUnit[]
    createField: (field: JSONField) => Field
  }
) => {
  const watcherHandler = createWatcherHandler()

  const points = shallowReactive([] as MachinePoint[])

  const report: BaseReport = shallowReactive({
    kind: parameters.kind,
    name: json.name,
    mapviewSettings: reactive(
      json.mapviewSettings || {
        isVisible: true,
        iconName: 'circle',
      }
    ),
    screenshots: shallowReactive([] as string[]),
    points,
    line: createLine(points, map),
    dropsSettings: reactive(json.dropsSettings),
    machineDetails: json.machineDetails,
    platform: shallowReactive(
      json.platform.map((field: JSONField) => parameters.createField(field))
    ),
    informations: shallowReactive(
      json.informations.map((field: JSONField) => parameters.createField(field))
    ),
    clean: function () {
      this.points.forEach((point) => {
        point.clean()
      })
      this.line.remove()
      watcherHandler.clean()
    },
  })

  watcherHandler.add(
    watch(
      () => report.dropsSettings.data.selected,
      (selectedData: number) => {
        report.points.forEach((point) => {
          point.selectedData = selectedData
        })
      },
      {
        immediate: true,
      }
    )
  )

  watcherHandler.add(
    watch(
      () => report.mapviewSettings.isVisible,
      (isVisible: boolean) => {
        report.points.forEach((point) => {
          if (isVisible && point.isVisible) {
            point.marker.addTo(map)
          } else {
            point.marker.remove()
          }
        })

        if (isVisible) {
          report.line.addToMap()
        } else {
          report.line.remove()
        }
      }
    )
  )

  watcherHandler.add(
    watch(
      () => report.mapviewSettings.iconName,
      (iconName: IconName) => {
        report.points.forEach((point) => {
          point.icon.setIcon(iconName)
        })
      }
    )
  )

  return report
}
