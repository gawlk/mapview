import { createBasePointFromJSON } from '../base'
import {
  createHeavydynDropFromJSON,
  createHeavydynFieldFromJSON,
} from '/src/scripts'

export const createHeavydynPointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map | null,
  parameters: HeavydynPointCreatorParameters
) => {
  const point: PartialMachinePoint<HeavydynPoint> = createBasePointFromJSON(
    json,
    map,
    {
      machine: 'Heavydyn',
      ...parameters,
    }
  )

  point.drops.push(
    ...json.drops.map((jsonDrop) =>
      createHeavydynDropFromJSON(jsonDrop, {
        point: point as HeavydynPoint,
      })
    )
  )

  point.informations.push(
    ...json.informations.map((field: JSONField) =>
      createHeavydynFieldFromJSON(field)
    )
  )

  return point as HeavydynPoint
}
