import { createMinidynPointFromJSON } from '/src/scripts'

import { createBaseZoneFromJSON } from '../base'

interface MinidynZoneCreatorParameters extends MachineZoneCreatorParameters {
  readonly report: MinidynReport
}

export const createMinidynZoneFromJSON = (
  json: JSONMinidynZoneVAny,
  map: mapboxgl.Map | null,
  parameters: MinidynZoneCreatorParameters
) => {
  json = upgradeJSON(json)

  const zone: MinidynZone = shallowReactive({
    ...createBaseZoneFromJSON(json.base, {
      report: parameters.report,
    }),
    machine: 'Minidyn',
    toJSON(): JSONMinidynZone {
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
      createMinidynPointFromJSON(jsonPoint, map, {
        zone: zone,
      })
    )
  )

  return zone
}

const upgradeJSON = (json: JSONMinidynZoneVAny): JSONMinidynZone => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
