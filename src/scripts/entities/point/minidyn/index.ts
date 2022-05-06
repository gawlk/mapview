import { createBasePointFromJSON } from '../base'
import { createMinidynDropFromJSON } from '/src/scripts'

export const createMinidynPointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map,
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

  point.drops = json.drops.map((jsonDrop) =>
    createMinidynDropFromJSON(jsonDrop, {
      reportDataLabels: parameters.reportDataLabels,
    })
  )

  return point as MinidynPoint
}
