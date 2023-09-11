import mapboxgl, { LngLatBounds } from 'mapbox-gl'

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
  Report extends BaseReport,
>(
  json: JSONBaseZoneVAny,
  parameters: {
    report: Report
  },
) => {
  json = upgradeJSON(json)

  const jsonSettings = upgradeSettingsJSON(json.settings)

  const watcherHandler = createWatcherHandler()

  const zone: BaseZone<Point, Report> = {
    name: json.name,
    points: createMutable([]),
    settings: createMutable(jsonSettings),
    report: parameters.report,
    data: createMutable([]),
    init() {
      this.points.forEach((point) => point.addToMap())

      void watcherHandler.add(
        on(
          () => this.settings.color,
          () => {
            this.points.forEach((point) => point.updateColor())

            this.report.line.update()
          },
        ),
      )

      void watcherHandler.add(
        on(
          () => this.settings.isVisible,
          () => {
            this.points.forEach((point) => {
              point.updateVisibility()
            })
            this.report.line.update()
          },
        ),
      )

      void watcherHandler.add(
        on(
          () => this.points.map((p) => p.index),
          () => {
            sortPoints(this.points)

            this.report.line.sortedPoints = [
              ...this.report.zones.map((_zone) => _zone.points),
            ].flat()

            // console.log(
            //   'set sortedPoints',
            //   this.report.name.toString(),
            //   this.report.line.sortedPoints.length,
            //   this.report.getExportablePoints().length,
            // )

            this.report.line.update()
          },
        ),
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
    getExportablePoints() {
      return this.points.filter((point) => point.settings.isVisible)
    },
    clean() {
      watcherHandler.clean()

      this.points.forEach((point) => {
        point.remove()
      })
    },
    toBaseJSON() {
      return {
        version: json.version,
        name: this.name,
        points: this.points.map((point) => point.toJSON()),
        settings: {
          version: jsonSettings.version,
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
  }

  return json
}
