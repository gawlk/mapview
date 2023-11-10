import {
  createMaxidynMathUnitsFromJSON,
  createMaxidynReportFromJSON,
} from '/src/scripts'

import { createBaseProjectFromJSON } from '../base'
import { getOwner } from 'solid-js'

export const createMaxidynProjectFromJSON = async (
  json: JSONMaxidynProjectVAny,
  map: mapboxgl.Map | null,
): Promise<MaxidynProject> =>
  new Promise((resolve) => {
    createRoot((dispose) => {
      json = upgradeJSON(json)

      const project: MaxidynProject = {
        ...createBaseProjectFromJSON(json.base, map, {
          reports: [] as MaxidynReport[],
          units: createMaxidynMathUnitsFromJSON(json.distinct.units),
          information: json.base.information,
          hardware: json.base.hardware,
        }),
        machine: 'Maxidyn',
        dispose() {
          this.reports
            .list()
            .forEach((report) =>
              report.zones().forEach((zone) => zone.dispose()),
            )

          dispose()
        },
        owner: getOwner(),
        bearingParameters: json.distinct.bearingParameters,
        toJSON(): JSONMaxidynProject {
          return {
            version: json.version,
            machine: 'Maxidyn',
            base: this.toBaseJSON(),
            distinct: {
              version: json.distinct.version,
              bearingParameters: json.distinct.bearingParameters,
              units: this.units.toJSON(),
            },
          }
        },
      }

      void batch(() => {
        const reports = json.base.reports.list.map((report) =>
          createMaxidynReportFromJSON(report as JSONMaxidynReport, map, {
            project,
          }),
        )

        project.reports.list.set(reports)

        project.reports.selectIndex(json.base.reports.selectedIndex)
      })

      resolve(project)
    })
  })

const upgradeJSON = (json: JSONMaxidynProjectVAny): JSONMaxidynProject => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
