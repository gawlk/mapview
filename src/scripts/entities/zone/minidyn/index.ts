import { createMinidynPointFromJSON } from '/src/scripts'

import { createBaseZoneFromJSON } from '../base'
import { getOwner, runWithOwner } from 'solid-js'

interface MinidynZoneCreatorParameters extends MachineZoneCreatorParameters {
  readonly report: MinidynReport
}

export const createMinidynZoneFromJSON = (
  json: JSONMinidynZoneVAny,
  map: mapboxgl.Map | null,
  parameters: MinidynZoneCreatorParameters,
): Promise<MinidynZone> =>
  new Promise((resolve) => {
    const owner = getOwner()

    createRoot((dispose) => {
      json = upgradeJSON(json)

      const zone: MinidynZone = {
        ...createBaseZoneFromJSON(json.base, {
          report: parameters.report,
        }),
        machine: 'Minidyn',
        dispose,
        owner,
        toJSON(): JSONMinidynZone {
          return {
            version: json.version,
            base: this.toBaseJSON(),
            distinct: {
              version: json.distinct.version,
            },
          }
        },
      }

      runWithOwner(owner, () => {
        zone.setPoints(
          json.base.points.map((jsonPoint) =>
            createMinidynPointFromJSON(jsonPoint, map, {
              zone,
            }),
          ),
        )
      })

      resolve(zone)
    })
  })

const upgradeJSON = (json: JSONMinidynZoneVAny): JSONMinidynZone => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
