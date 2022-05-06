import { createBaseZoneFromJSON } from '../base'
import { createMinidynPointFromJSON } from '/src/scripts'

export const createMinidynZoneFromJSON = (
  json: JSONZone,
  map: mapboxgl.Map,
  parameters: MinidynZoneCreatorParameters
) => {
  const zone: PartialMachineZone<MinidynZone> = createBaseZoneFromJSON(json, {
    machine: 'Minidyn',
    ...parameters,
  })

  zone.points.push(
    ...json.points.map((jsonPoint) =>
      createMinidynPointFromJSON(jsonPoint, map, {
        projectSettings: parameters.projectSettings,
        reportSettings: parameters.reportSettings,
        reportDataLabels: parameters.reportDataLabels,
        reportThresholds: parameters.reportThresholds,
        zoneSettings: zone.settings,
      })
    )
  )

  return zone as MinidynZone
}
