import { createBasePointFromJSON } from '../base'
import { createHeavydynDropFromJSON } from '/src/scripts'

export const createHeavydynPointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map,
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

  point.drops = json.drops.map((jsonDrop) =>
    createHeavydynDropFromJSON(jsonDrop, {
      reportDataLabels: parameters.reportDataLabels,
    })
  )

  return point as HeavydynPoint
}
