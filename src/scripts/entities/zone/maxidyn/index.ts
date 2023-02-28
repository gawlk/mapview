import { createMaxidynPointFromJSON } from '/src/scripts'

import { createBaseZoneFromJSON } from '../base'

interface MaxidynZoneCreatorParameters extends MachineZoneCreatorParameters {
  readonly report: MaxidynReport
}

export const createMaxidynZoneFromJSON = (
  json: JSONMaxidynZoneVAny,
  map: mapboxgl.Map | null,
  parameters: MaxidynZoneCreatorParameters
) => {
  json = upgradeJSON(json)

  const zone: MaxidynZone = createMutable({
    ...createBaseZoneFromJSON(json.base, {
      report: parameters.report,
    }),
    machine: 'Maxidyn',
    toJSON: function (): JSONMaxidynZone {
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
      createMaxidynPointFromJSON(jsonPoint, map, {
        zone: zone as MaxidynZone,
      })
    )
  )

  return zone as MaxidynZone
}

const upgradeJSON = (json: JSONMaxidynZoneVAny): JSONMaxidynZone => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMaxidynZone
  }

  return json
}
