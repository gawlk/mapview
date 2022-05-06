import { createBaseZoneFromJSON } from '../base'
import { createHeavydynPointFromJSON } from '/src/scripts'

export const createHeavydynZoneFromJSON = (
  json: JSONZone,
  map: mapboxgl.Map,
  parameters: HeavydynZoneCreatorParameters
) => {
  const zone: PartialMachineZone<HeavydynZone> = createBaseZoneFromJSON(json, {
    machine: 'Heavydyn',
    ...parameters,
  })

  zone.points.push(
    ...json.points.map((jsonPoint) =>
      createHeavydynPointFromJSON(jsonPoint, map, {
        projectSettings: parameters.projectSettings,
        reportSettings: parameters.reportSettings,
        reportDataLabels: parameters.reportDataLabels,
        reportThresholds: parameters.reportThresholds,
        zoneSettings: zone.settings,
      })
    )
  )

  return zone as HeavydynZone
}
