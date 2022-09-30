import { createBasePointFromJSON } from '../base'
import {
  createMaxidynDropFromJSON,
  createMaxidynFieldFromJSON,
} from '/src/scripts'

export const createMaxidynPointFromJSON = (
  json: JSONBasePointVAny,
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

  point.information.push(
    ...json.information.map((field: JSONBaseField) =>
      createMaxidynFieldFromJSON(field)
    )
  )

  return point as MaxidynPoint
}
