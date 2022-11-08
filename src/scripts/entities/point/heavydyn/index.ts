import { createBasePointFromJSON } from '../base'
import { createHeavydynDropFromJSON, createFieldFromJSON } from '/src/scripts'

interface HeavydynPointCreatorParameters extends MachinePointCreatorParameters {
  zone: HeavydynZone
}

export const createHeavydynPointFromJSON = (
  json: JSONHeavydynPointVAny,
  map: mapboxgl.Map | null,
  parameters: HeavydynPointCreatorParameters
) => {
  json = upgradeJSON(json)

  const point: PartialMachinePoint<HeavydynPoint> = createBasePointFromJSON(
    json.base,
    map,
    {
      machine: 'Heavydyn',
      zone: parameters.zone,
    }
  )

  point.drops.push(
    ...json.base.drops.map((jsonDrop) =>
      createHeavydynDropFromJSON(jsonDrop, {
        point: point as HeavydynPoint,
      })
    )
  )

  point.information.push(
    ...json.base.information.map((field: JSONField) =>
      createFieldFromJSON(field)
    )
  )

  point.toJSON = function (): JSONHeavydynPoint {
    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
      },
    }
  }

  return point as HeavydynPoint
}

const upgradeJSON = (json: JSONHeavydynPointVAny): JSONHeavydynPoint => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONHeavydynPoint
  }

  return json
}
