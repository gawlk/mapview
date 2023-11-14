import { ReactiveMap } from '@solid-primitives/map'
import { debounce } from '@solid-primitives/scheduled'
import mapboxgl, { LngLatBounds } from 'mapbox-gl'

import {
  createASS,
  getRandomColorName,
  isSorted,
  sortPoints,
  upgradeColorNameFromV1ToV2,
} from '/src/scripts'
import { store } from '/src/store'

export const createBaseZoneFromJSON = <
  Point extends MachinePoint,
  Report extends BaseReport,
>(
  json: JSONBaseZoneVAny,
  parameters: {
    report: Report
  },
) => {
  const { report } = parameters

  json = upgradeJSON(json)

  const jsonSettings = upgradeSettingsJSON(json.settings)

  const points = createASS<Point[]>([], {
    equals: false,
  })

  const exportablePoints = createMemo(() =>
    points().filter((point) => point.settings.isVisible()),
  )

  const zone: BaseZone<Point, Report> = {
    name: createASS(json.name),
    points,
    setPoints(_points) {
      points.set(sortPoints(_points) as Point[])
    },
    settings: createZoneSettingsFromJSON(jsonSettings),
    report: createASS(report),
    dataset: new ReactiveMap(),
    exportablePoints,
    fitOnMap(map: mapboxgl.Map) {
      const bounds = new LngLatBounds()

      this.points().forEach((point) => {
        if (point.settings.isVisible() && point.marker) {
          bounds.extend(point.marker.getLngLat())
        }
      })

      if (bounds.getCenter()) {
        map?.fitBounds(bounds, {
          padding: 100,
        })
      }
    },
    toBaseJSON() {
      return {
        version: json.version,
        name: this.name(),
        points: this.points().map((point) => point.toJSON()),
        settings: this.settings.toJSON(),
      }
    },
  }

  const selfSortPoints = debounce(() => {
    zone.setPoints(zone.points())
  }, 100)

  createEffect(() => {
    if (
      report.project() === store.selectedProject() &&
      !isSorted(points().map((point) => point.index()))
    ) {
      selfSortPoints()
    }
  })

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

export const createZoneSettingsFromJSON = (
  json: JSONZoneSettings,
): ZoneSettings => ({
  color: createASS(json.color),
  isVisible: createASS(json.isVisible),
  toJSON() {
    return {
      version: 2,
      color: this.color(),
      isVisible: this.isVisible(),
    }
  },
})
