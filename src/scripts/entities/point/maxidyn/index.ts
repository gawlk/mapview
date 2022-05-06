import { createBasePointFromJSON } from '../base'
import { createMaxidynDropFromJSON } from '/src/scripts'

export const createMaxidynPointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map,
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

  point.drops = json.drops.map((jsonDrop) =>
    createMaxidynDropFromJSON(jsonDrop, {
      reportDataLabels: parameters.reportDataLabels,
    })
  )

  return point as MaxidynPoint
}
