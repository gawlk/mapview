import { createHeavydynPointFromJSON } from '/src/scripts'

import { createBaseZoneFromJSON } from '../base'
import { getOwner, runWithOwner } from 'solid-js'

interface HeavydynZoneCreatorParameters extends MachineZoneCreatorParameters {
  readonly report: HeavydynReport
}

export const createHeavydynZoneFromJSON = (
  json: JSONHeavydynZoneVAny,
  map: mapboxgl.Map | null,
  parameters: HeavydynZoneCreatorParameters,
): Promise<HeavydynZone> =>
  new Promise((resolve) => {
    const owner = getOwner()

    createRoot((dispose) => {
      json = upgradeJSON(json)

      const zone: HeavydynZone = {
        ...createBaseZoneFromJSON(json.base, {
          report: parameters.report,
        }),
        machine: 'Heavydyn',
        dispose,
        owner,
        toJSON(): JSONHeavydynZone {
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
            createHeavydynPointFromJSON(jsonPoint, map, {
              zone,
            }),
          ),
        )
      })

      resolve(zone)
    })
  })

const upgradeJSON = (json: JSONHeavydynZoneVAny): JSONHeavydynZone => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
