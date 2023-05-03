import { createMinidynDropFromJSON } from '/src/scripts'

import { createBasePointFromJSON } from '../base'

export const createMinidynPointFromJSON = (
  json: JSONMinidynPointVAny,
  map: mapboxgl.Map | null,
  parameters: {
    zone: MinidynZone
  }
) => {
  json = upgradeJSON(json)

  const basePoint = createBasePointFromJSON(json.base, map, {
    zone: parameters.zone,
    information: json.base.information,
    drops: [] as MinidynDrop[],
  })

  const point: MinidynPoint = shallowReactive({
    ...basePoint,
    machine: 'Minidyn',
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
      createMinidynDropFromJSON(jsonDrop, {
        point,
      })
    )
  )

  return point
}

const upgradeJSON = (json: JSONMinidynPointVAny): JSONMinidynPoint => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
