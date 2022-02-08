import { createBasePointFromJSON } from '../base'

export const createMinidynPointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map,
  parameters: MachinePointCreatorParameters
) => {
  const point: PartialMachinePoint<MinidynPoint> = createBasePointFromJSON(
    json,
    map,
    {
      machine: 'minidyn',
      ...parameters,
    }
  )

  return point as MinidynPoint
}
