import { createBasePointFromJSON } from '../base'
import {
  createMinidynDropFromJSON,
  createMinidynFieldFromJSON,
} from '/src/scripts'

export const createMinidynPointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map | null,
  parameters: MinidynPointCreatorParameters
) => {
  const point: PartialMachinePoint<MinidynPoint> = createBasePointFromJSON(
    json,
    map,
    {
      machine: 'Minidyn',
      ...parameters,
    }
  )

  point.drops.push(
    ...json.drops.map((jsonDrop) =>
      createMinidynDropFromJSON(jsonDrop, {
        point: point as MinidynPoint,
      })
    )
  )

  point.informations.push(
    ...json.informations.map((field: JSONField) =>
      createMinidynFieldFromJSON(field)
    )
  )

  return point as MinidynPoint
}
