import { createBaseZoneFromJSON } from '../base'
import { createMinidynPointFromJSON } from '/src/scripts'

export const createMinidynZoneFromJSON = (
  json: JSONBaseZoneVAny,
  map: mapboxgl.Map | null,
  parameters: MinidynZoneCreatorParameters
) => {
  const zone: PartialMachineZone<MinidynZone> = createBaseZoneFromJSON(json, {
    machine: 'Minidyn',
    ...parameters,
  })

  zone.points.push(
    ...json.points.map((jsonPoint) =>
      createMinidynPointFromJSON(jsonPoint, map, {
        zone: zone as MinidynZone,
      })
    )
  )

  return zone as MinidynZone
}
