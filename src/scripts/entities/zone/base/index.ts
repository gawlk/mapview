import {
  createWatcherHandler,
  getRandomColorName,
  sortPoints,
  upgradeColorNameFromV1ToV2,
} from '/src/scripts'

export const createJSONBaseZone = (length: number) => {
  const json: JSONBaseZone = {
    version: 1,
    name: `Zone ${length + 1}`,
    settings: {
      version: 1,
      color: getRandomColorName(),
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
    points: shallowReactive([]),
    settings: shallowReactive(upgradeSettingsJSON(json.settings)),
    report: parameters.report,
    data: shallowReactive([]),
    init() {
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
          () => this.points.map((p) => p.index),
          () => {
            sortPoints(this.points)

            this.report.line.sortedPoints = Array.prototype.concat(
              ...this.report.zones.map((_zone) => _zone.points)
            )
            this.report.line.update()
          },
          {
            immediate: true,
          }
        )
      )
    },
    clean() {
      watcherHandler.clean()

      this.points.forEach((point) => {
        point.remove()
      })
    },
    toBaseJSON(): JSONBaseZone {
      return {
        version: json.version,
        name: this.name,
        points: this.points.map((point) => point.toJSON()),
        settings: {
          version: 2,
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
    // for update want to have no break
    // eslint-disable-next-line no-fallthrough
    default:
      json = json as JSONBaseZone
  }

  return json
}

const upgradeSettingsJSON = (json: JSONZoneSettingsVAny): JSONZoneSettings => {
  switch (json.version) {
    case 1:
      json = {
        ...json,
        version: 2,
        color: upgradeColorNameFromV1ToV2(json.color),
      }
    // for update want to have no break
    // eslint-disable-next-line no-fallthrough
    default:
      json = json as JSONZoneSettings
  }

  return json
}
