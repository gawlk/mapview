import mapboxgl, { LngLatBounds } from 'mapbox-gl'

import { colors, createWatcherHandler, sortPoints } from '/src/scripts'

export const createJSONBaseZone = (length: number) => {
  const colorNames = Object.keys(colors)

  const json: JSONBaseZone = {
    version: 1,
    name: `Zone ${length + 1}`,
    settings: {
      version: 1,
      color: colorNames[
        Math.floor(Math.random() * colorNames.length)
      ] as ColorName,
      isVisible: true,
    },
    points: [],
  }

  return json
}

export const createBaseZoneFromJSON = <
  Point extends MachinePoint,
  Report extends BaseReport
>(
  json: JSONBaseZoneVAny,
  parameters: {
    report: Report
  }
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  const zone: BaseZone<Point, Report> = {
    name: json.name,
    points: createMutable([]),
    settings: createMutable(json.settings),
    report: parameters.report,
    data: createMutable([]),
    init: function () {
      this.points.forEach((point) => point.addToMap())

      watcherHandler.add(
        on(
          () => this.settings.color,
          () => {
            this.points.forEach((point) => point.updateColor())

            this.report.line.update()
          }
        )
      )

      watcherHandler.add(
        on(
          () => this.settings.isVisible,
          () => {
            this.points.forEach((point) => {
              point.updateVisibility()
            })
            this.report.line.update()
          }
        )
      )

      // TODO: Move all or a part to report
      watcherHandler.add(
        on(
          () => this.points.length,
          () => {
            sortPoints(this.points)

            this.report.line.sortedPoints = Array.prototype.concat(
              ...this.report.zones.map((zone) => zone.points)
            ) as MachinePoint[]

            this.report.line.update()
          }
        )
      )
    },
    fitOnMap(map: mapboxgl.Map) {
      const bounds = new LngLatBounds()

      this.points.forEach((point) => {
        if (point.settings.isVisible && point.marker) {
          bounds.extend(point.marker.getLngLat())
        }
      })

      if (bounds.getCenter()) {
        map?.fitBounds(bounds, { padding: 100 })
      }
    },
    clean: function () {
      watcherHandler.clean()

      this.points.forEach((point) => {
        point.remove()
      })
    },
    toBaseJSON: function (): JSONBaseZone {
      return {
        version: json.version,
        name: this.name,
        points: this.points.map((point) => point.toJSON()),
        settings: {
          version: json.settings.version,
          color: this.settings.color,
          isVisible: this.settings.isVisible,
        },
      }
    },
  }

  return zone
}

const upgradeJSON = (json: JSONBaseZoneVAny): JSONBaseZone => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONBaseZone
  }

  return json
}
