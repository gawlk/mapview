import {
  createMinidynMathUnitsFromJSON,
  createMinidynReportFromJSON,
} from '/src/scripts'

import { createBaseProjectFromJSON } from '../base'
import { getOwner } from 'solid-js'

export const createMinidynProjectFromJSON = async (
  json: JSONMinidynProjectVAny,
  map: mapboxgl.Map | null,
): Promise<MinidynProject> =>
  new Promise((resolve) => {
    createRoot((dispose) => {
      json = upgradeJSON(json)

      const project: MinidynProject = {
        ...createBaseProjectFromJSON(json.base, map, {
          reports: [] as MinidynReport[],
          units: createMinidynMathUnitsFromJSON(json.distinct.units),
          information: json.base.information,
          hardware: json.base.hardware,
        }),
        machine: 'Minidyn',
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
        toJSON(): JSONMinidynProject {
          return {
            version: json.version,
            machine: 'Minidyn',
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
          createMinidynReportFromJSON(report as JSONMinidynReport, map, {
            project,
          }),
        )

        project.reports.list.set(reports)

        project.reports.selectIndex(json.base.reports.selectedIndex)
      })

      resolve(project)
    })
  })

const upgradeJSON = (json: JSONMinidynProjectVAny): JSONMinidynProject => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
