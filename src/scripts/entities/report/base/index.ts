import { LngLatBounds } from 'mapbox-gl'
import {
  createBaseFieldFromJSON,
  createLine,
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

  const settings: JSONReportSettings = reactive(json.settings)

  const points: MachinePoint[] = shallowReactive([])

  const report: BaseReport = shallowReactive({
    machine: parameters.machine,
    name: createBaseFieldFromJSON(
      {
        name: 'Name',
        value: json.name,
      },
      true
    ),
    isOnMap: false as boolean,
    settings,
    screenshots: shallowReactive([] as string[]),
    valuesNames: generateValuesNames(
      json,
      parameters.dropList,
      parameters.pointList,
      parameters.zoneList
    ),
    points,
    zones: json.zones.map((zone) => createZone(zone)),
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
      console.log('report add to map')

      this.isOnMap = true

      this.points.forEach((point) => {
        point.addToMap()
      })

      if (json.settings.isVisible) {
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

const generateValuesNames = (
  json: JSONReport,
  dropList: ValueName[],
  pointList: ValueName[],
  zoneList: ValueName[]
) => {
  const generateValuesSelectableList = (
    jsonSelectableList: SelectableOptionalList<number, string>,
    list: ValueName[]
  ) => {
    return {
      selected: getObjectFromSelectedIndexInSelectableList(
        jsonSelectableList.selected,
        list
      ),
      list,
    }
  }

  return {
    selectedList: json.values.selectedList,
    drop: generateValuesSelectableList(json.values.drop, dropList),
    point: generateValuesSelectableList(json.values.point, pointList),
    zone: generateValuesSelectableList(json.values.zone, zoneList),
  }
}
