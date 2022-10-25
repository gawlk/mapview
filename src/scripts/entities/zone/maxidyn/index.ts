import { createBaseZoneFromJSON } from '../base'
import { createMaxidynPointFromJSON } from '/src/scripts'

interface MaxidynZoneCreatorParameters extends MachineZoneCreatorParameters {}

export const createMaxidynZoneFromJSON = (
  json: JSONMaxidynZoneVAny,
  map: mapboxgl.Map | null,
  parameters: MaxidynZoneCreatorParameters
) => {
  json = upgradeJSON(json)

  const zone: PartialMachineZone<MaxidynZone> = createBaseZoneFromJSON(
    json.base,
    {
      machine: 'Maxidyn',
      ...parameters,
    }
  )

  zone.points.push(
    ...json.base.points.map((jsonPoint) =>
      createMaxidynPointFromJSON(jsonPoint, map, {
        zone: zone as MaxidynZone,
      })
    )
  )

  zone.toJSON = function (): JSONMaxidynZone {
    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
      },
    }
  }

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
