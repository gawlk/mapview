import { createFieldFromJSON, createMinidynDropFromJSON } from '/src/scripts'

import { createBasePointFromJSON } from '../base'

interface MinidynPointCreatorParameters extends MachinePointCreatorParameters {
  zone: MinidynZone
}

export const createMinidynPointFromJSON = (
  json: JSONMinidynPointVAny,
  map: mapboxgl.Map | null,
  parameters: MinidynPointCreatorParameters
) => {
  json = upgradeJSON(json)

  const point: PartialMachinePoint<MinidynPoint> = createBasePointFromJSON(
    json.base,
    map,
    {
      machine: 'Minidyn',
      zone: parameters.zone,
    }
  )

  point.drops.push(
    ...json.base.drops.map((jsonDrop) =>
      createMinidynDropFromJSON(jsonDrop, {
        point: point as MinidynPoint,
      })
    )
  )

  point.information.push(
    ...json.base.information.map((field: JSONField) =>
      createFieldFromJSON(field)
    )
  )

  point.toJSON = function (): JSONMinidynPoint {
    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
      },
    }
  }

  return point as MinidynPoint
}

const upgradeJSON = (json: JSONMinidynPointVAny): JSONMinidynPoint => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMinidynPoint
  }

  return json
}
