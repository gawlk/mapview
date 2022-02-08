import { createBasePointFromJSON } from '../base'

export const createMaxidynPointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map,
  parameters: MachinePointCreatorParameters
) => {
  const point: PartialMachinePoint<MaxidynPoint> = createBasePointFromJSON(
    json,
    map,
    {
      machine: 'maxidyn',
      ...parameters,
    }
  )

  return point as MaxidynPoint
}
