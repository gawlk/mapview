import { createHeavydynDropFromJSON } from '/src/scripts'

import { createBasePointFromJSON } from '../base'

export const createHeavydynPointFromJSON = (
  json: JSONHeavydynPointVAny,
  map: mapboxgl.Map | null,
  parameters: {
    zone: HeavydynZone
  }
) => {
  json = upgradeJSON(json)

  const point = createMutable<HeavydynPoint>({
    ...createBasePointFromJSON(json.base, map, {
      zone: parameters.zone,
      information: json.base.information,
      drops: [] as HeavydynDrop[],
    }),
    machine: 'Heavydyn',
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
      createHeavydynDropFromJSON(jsonDrop, {
        point,
      })
    )
  )

  return point
}

const upgradeJSON = (json: JSONHeavydynPointVAny): JSONHeavydynPoint => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
