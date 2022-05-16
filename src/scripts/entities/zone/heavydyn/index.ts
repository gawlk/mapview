import { createBaseZoneFromJSON } from '../base'
import { createHeavydynPointFromJSON } from '/src/scripts'

export const createHeavydynZoneFromJSON = (
  json: JSONZone,
  map: mapboxgl.Map | null,
  parameters: HeavydynZoneCreatorParameters
) => {
  const zone: PartialMachineZone<HeavydynZone> = createBaseZoneFromJSON(json, {
    machine: 'Heavydyn',
    ...parameters,
  })

  zone.points.push(
    ...json.points.map((jsonPoint) =>
      createHeavydynPointFromJSON(jsonPoint, map, {
        zone: zone as HeavydynZone,
      })
    )
  )

  return zone as HeavydynZone
}
