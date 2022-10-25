import { createBaseZoneFromJSON } from '../base'
import { createHeavydynPointFromJSON } from '/src/scripts'

interface HeavydynZoneCreatorParameters extends MachineZoneCreatorParameters {}

export const createHeavydynZoneFromJSON = (
  json: JSONHeavydynZoneVAny,
  map: mapboxgl.Map | null,
  parameters: HeavydynZoneCreatorParameters
) => {
  json = upgradeJSON(json)

  const zone: PartialMachineZone<HeavydynZone> = createBaseZoneFromJSON(
    json.base,
    {
      machine: 'Heavydyn',
      ...parameters,
    }
  )

  zone.points.push(
    ...json.base.points.map((jsonPoint) =>
      createHeavydynPointFromJSON(jsonPoint, map, {
        zone: zone as HeavydynZone,
      })
    )
  )

  zone.toJSON = function (): JSONHeavydynZone {
    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
      },
    }
  }

  return zone as HeavydynZone
}

const upgradeJSON = (json: JSONHeavydynZoneVAny): JSONHeavydynZone => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONHeavydynZone
  }

  return json
}
