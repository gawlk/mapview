import { createBasePointFromJSON } from '../base'

export const createHeavydynPointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map,
  parameters: MachinePointCreatorParameters
) => {
  const point: PartialMachinePoint<HeavydynPoint> = createBasePointFromJSON(
    json,
    map,
    {
      machine: 'heavydyn',
      ...parameters,
    }
  )

  return point as HeavydynPoint
}
