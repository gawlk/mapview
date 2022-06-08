import { createBaseZoneFromJSON } from '../base'
import { createMaxidynPointFromJSON } from '/src/scripts'

export const createMaxidynZoneFromJSON = (
  json: JSONZone,
  map: mapboxgl.Map | null,
  parameters: MaxidynZoneCreatorParameters
) => {
  const zone: PartialMachineZone<MaxidynZone> = createBaseZoneFromJSON(json, {
    machine: 'Maxidyn',
    ...parameters,
  })

  zone.points.push(
    ...json.points.map((jsonPoint) =>
      createMaxidynPointFromJSON(jsonPoint, map, {
        zone: zone as MaxidynZone,
      })
    )
  )

  return zone as MaxidynZone
}
