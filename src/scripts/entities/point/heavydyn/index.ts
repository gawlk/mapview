import { createBasePointFromJSON } from '../base'
import { createHeavydynDropFromJSON } from '/src/scripts'

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

  return point as HeavydynPoint
}
