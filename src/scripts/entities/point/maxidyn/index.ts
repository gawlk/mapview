import { createBasePointFromJSON } from '../base'
import { createMaxidynDropFromJSON, createFieldFromJSON } from '/src/scripts'

interface MaxidynPointCreatorParameters extends MachinePointCreatorParameters {
  zone: MaxidynZone
}

export const createMaxidynPointFromJSON = (
  json: JSONMaxidynPointVAny,
  map: mapboxgl.Map | null,
  parameters: MaxidynPointCreatorParameters
) => {
  json = upgradeJSON(json)

  const point: PartialMachinePoint<MaxidynPoint> = createBasePointFromJSON(
    json.base,
    map,
    {
      machine: 'Maxidyn',
      ...parameters,
    }
  )

  point.drops.push(
    ...json.base.drops.map((jsonDrop) =>
      createMaxidynDropFromJSON(jsonDrop, {
        point: point as MaxidynPoint,
      })
    )
  )

  point.information.push(
    ...json.base.information.map((field: JSONField) =>
      createFieldFromJSON(field)
    )
  )

  point.toJSON = function (): JSONMaxidynPoint {
    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
      },
    }
  }

  return point as MaxidynPoint
}

const upgradeJSON = (json: JSONMaxidynPointVAny): JSONMaxidynPoint => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMaxidynPoint
  }

  return json
}
