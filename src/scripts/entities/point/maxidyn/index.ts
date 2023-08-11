import { createMaxidynDropFromJSON } from '/src/scripts'

import { createBasePointFromJSON } from '../base'

export const createMaxidynPointFromJSON = (
  json: JSONMaxidynPointVAny,
  map: mapboxgl.Map | null,
  parameters: {
    zone: MaxidynZone
  },
) => {
  json = upgradeJSON(json)

  const point = createMutable<MaxidynPoint>({
    ...createBasePointFromJSON(json.base, map, {
      zone: parameters.zone,
      information: json.base.information,
      drops: [] as MaxidynDrop[],
    }),
    machine: 'Maxidyn',
    toJSON() {
      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
        },
      }
    },
  })

  point.drops.push(
    ...json.base.drops.map((jsonDrop) =>
      createMaxidynDropFromJSON(jsonDrop, {
        point,
      }),
    ),
  )

  return point
}

const upgradeJSON = (json: JSONMaxidynPointVAny): JSONMaxidynPoint => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
