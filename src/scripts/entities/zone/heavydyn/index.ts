import { createHeavydynPointFromJSON } from '/src/scripts'

import { createBaseZoneFromJSON } from '../base'

interface HeavydynZoneCreatorParameters extends MachineZoneCreatorParameters {
  readonly report: HeavydynReport
}

export const createHeavydynZoneFromJSON = (
  json: JSONHeavydynZoneVAny,
  map: mapboxgl.Map | null,
  parameters: HeavydynZoneCreatorParameters
) => {
  json = upgradeJSON(json)

  // TODO: Add average of all temps of points

  const zone: HeavydynZone = createMutable({
    ...createBaseZoneFromJSON(json.base, {
      report: parameters.report,
    }),
    machine: 'Heavydyn',
    toJSON(): JSONHeavydynZone {
      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
        },
      }
    },
  })

  zone.points.push(
    ...json.base.points.map((jsonPoint) =>
      createHeavydynPointFromJSON(jsonPoint, map, {
        zone,
      })
    )
  )

  return zone
}

const upgradeJSON = (json: JSONHeavydynZoneVAny): JSONHeavydynZone => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
