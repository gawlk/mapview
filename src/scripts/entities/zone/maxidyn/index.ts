import { createMaxidynPointFromJSON } from '/src/scripts'

import { createBaseZoneFromJSON } from '../base'
import { getOwner, runWithOwner } from 'solid-js'

interface MaxidynZoneCreatorParameters extends MachineZoneCreatorParameters {
  readonly report: MaxidynReport
}

export const createMaxidynZoneFromJSON = (
  json: JSONMaxidynZoneVAny,
  map: mapboxgl.Map | null,
  parameters: MaxidynZoneCreatorParameters,
): Promise<MaxidynZone> =>
  new Promise((resolve) => {
    const owner = getOwner()

    createRoot((dispose) => {
      json = upgradeJSON(json)

      const zone: MaxidynZone = {
        ...createBaseZoneFromJSON(json.base, {
          report: parameters.report,
        }),
        machine: 'Maxidyn',
        dispose,
        owner,
        toJSON(): JSONMaxidynZone {
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
            createMaxidynPointFromJSON(jsonPoint, map, {
              zone,
            }),
          ),
        )
      })

      resolve(zone)
    })
  })

const upgradeJSON = (json: JSONMaxidynZoneVAny): JSONMaxidynZone => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
