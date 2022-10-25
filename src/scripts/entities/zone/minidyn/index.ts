import { createBaseZoneFromJSON } from '../base'
import { createMinidynPointFromJSON } from '/src/scripts'

interface MinidynZoneCreatorParameters extends MachineZoneCreatorParameters {}

export const createMinidynZoneFromJSON = (
  json: JSONMinidynZoneVAny,
  map: mapboxgl.Map | null,
  parameters: MinidynZoneCreatorParameters
) => {
  json = upgradeJSON(json)

  const zone: PartialMachineZone<MinidynZone> = createBaseZoneFromJSON(
    json.base,
    {
      machine: 'Minidyn',
      ...parameters,
    }
  )

  zone.points.push(
    ...json.base.points.map((jsonPoint) =>
      createMinidynPointFromJSON(jsonPoint, map, {
        zone: zone as MinidynZone,
      })
    )
  )

  zone.toJSON = function (): JSONMinidynZone {
    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
      },
    }
  }

  return zone as MinidynZone
}

const upgradeJSON = (json: JSONMinidynZoneVAny): JSONMinidynZone => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMinidynZone
  }

  return json
}
