import { createBasePointFromJSON } from '../base'
import { createMaxidynDropFromJSON } from '/src/scripts'

export const createMaxidynPointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map | null,
  parameters: MaxidynPointCreatorParameters
) => {
  const point: PartialMachinePoint<MaxidynPoint> = createBasePointFromJSON(
    json,
    map,
    {
      machine: 'Maxidyn',
      ...parameters,
    }
  )

  point.drops.push(
    ...json.drops.map((jsonDrop) =>
      createMaxidynDropFromJSON(jsonDrop, {
        point: point as MaxidynPoint,
      })
    )
  )

  return point as MaxidynPoint
}
