import { createBaseZoneFromJSON } from '../base'
import { createMaxidynPointFromJSON } from '/src/scripts'

export const createMaxidynZoneFromJSON = (
  json: JSONZone,
  map: mapboxgl.Map,
  parameters: MaxidynZoneCreatorParameters
) => {
  const zone: PartialMachineZone<MaxidynZone> = createBaseZoneFromJSON(json, {
    machine: 'Maxidyn',
    ...parameters,
  })

  zone.points.push(
    ...json.points.map((jsonPoint) =>
      createMaxidynPointFromJSON(jsonPoint, map, {
        projectSettings: parameters.projectSettings,
        reportSettings: parameters.reportSettings,
        reportDataLabels: parameters.reportDataLabels,
        reportThresholds: parameters.reportThresholds,
        zoneSettings: zone.settings,
      })
    )
  )

  return zone as MaxidynZone
}
