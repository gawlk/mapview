import { createWatcherHandler, sortPoints } from '/src/scripts'

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
    points: shallowReactive([]),
    settings: shallowReactive(json.settings),
    report: parameters.report,
    init: function () {
      this.points.forEach((point) => point.addToMap())

      watcherHandler.add(
        watch(
          () => this.settings.color,
          () => {
            this.points.forEach((point) => point.updateColor())

            this.report.line.update()
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.isVisible,
          () => {
            this.points.forEach((point) => {
              point.updateVisibility()
            })
            this.report.line.update()
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.points.length,
          () => {
            sortPoints(this.points)

            this.report.line.sortedPoints = Array.prototype.concat(
              ...this.report.zones.map((zone) => zone.points)
            ) as MachinePoint[]

            this.report.line.update()
          },
          {
            immediate: true,
          }
        )
      )
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
