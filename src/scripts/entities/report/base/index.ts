import { LngLatBounds } from 'mapbox-gl'
import {
  createBaseFieldFromJSON,
  createLine,
  createSelectableList,
  createWatcherHandler,
  createZone,
} from '/src/scripts'

export const createBaseReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: BaseReportCreatorParameters
) => {
  const watcherHandler = createWatcherHandler()

  const points: MachinePoint[] = shallowReactive([])

  const tableDataLabelsList: TableDataLabelsParameters[] =
    parameters.groupedDataLabels.list.map((group) => {
      const tableDataLabels = json.dataLabels.table.list?.find(
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
            .filter((dataLabel) => dataLabel) as DataLabel[]
        ),
      })
    })

  const dataLabels: ReportDataLabels = {
    groups: parameters.groupedDataLabels,
    table: createSelectableList(
      json.dataLabels.table.selected,
      tableDataLabelsList,
      {
        reactive: true,
        isSelectedAnIndex: true,
      }
    ),
  }

  const report: BaseReport = shallowReactive({
    machine: parameters.machine,
    name: createBaseFieldFromJSON(
      {
        label: 'Name',
        value: json.name,
      },
      true
    ),
    isOnMap: false as boolean,
    settings: reactive(json.settings),
    screenshots: shallowReactive([] as string[]),
    points,
    dataLabels,
    zones: shallowReactive(json.zones.map((zone) => createZone(zone))),
    line: createLine(points, map),
    platform: shallowReactive([]),
    informations: shallowReactive([]),
    fitOnMap: function () {
      const bounds = new LngLatBounds()

      this.points.forEach((point: MachinePoint) => {
        bounds.extend(point.marker.getLngLat())
      })

      map.fitBounds(bounds, { padding: 100 })
    },
    addToMap: function () {
      this.isOnMap = true

      this.points.forEach((point) => {
        point.addToMap()
      })

      if (this.settings.isVisible) {
        this.line.addToMap()
      }

      watcherHandler.add(
        watch(
          () => this.settings.isVisible,
          (isVisible: boolean) => {
            this.points.forEach((point) => {
              isVisible ? point.addToMap() : point.remove()
            })

            if (parameters.projectSettings.arePointsLinked && isVisible) {
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
  })

  return report
}
