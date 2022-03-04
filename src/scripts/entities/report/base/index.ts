import { LngLatBounds } from 'mapbox-gl'
import {
  createBaseFieldFromJSON,
  createLine,
  createSelectableList,
  createWatcherHandler,
  createZone,
  getObjectFromSelectedIndexInSelectableList,
} from '/src/scripts'

export const createBaseReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: BaseReportCreatorParameters
) => {
  const watcherHandler = createWatcherHandler()

  const points: MachinePoint[] = shallowReactive([])

  const tableValuesNamesList: TableValuesNamesParameters[] =
    parameters.groupedValuesNames.list.map((group) => {
      const tableValuesNames = json.valuesNames.table.list?.find(
        (tableValuesNames) => tableValuesNames.from === group.from
      )

      return shallowReactive({
        group,
        index: tableValuesNames?.index ?? 0,
        valuesNames: shallowReactive(
          (tableValuesNames?.valuesNames || [])
            .map((name) =>
              group.choices.list.find((choice) => choice.name === name)
            )
            .filter((valueName) => valueName) as ValueName[]
        ),
      })
    })

  const valuesNames: ReportValuesNames = {
    groups: parameters.groupedValuesNames,
    table: createSelectableList(
      getObjectFromSelectedIndexInSelectableList(
        json.valuesNames.table.selected,
        tableValuesNamesList
      ),
      tableValuesNamesList,
      true
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
    valuesNames,
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
