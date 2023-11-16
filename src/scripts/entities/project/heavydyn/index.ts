import {
  createHeavydynMathUnitsFromJSON,
  createHeavydynReportFromJSON,
} from '/src/scripts'

import { createBaseProjectFromJSON } from '../base'
import { createHeavydynProjectCorrectionParametersFromJSON } from './correctionParameters'
import { getOwner } from 'solid-js'

export const createHeavydynProjectFromJSON = async (
  json: JSONHeavydynProjectVAny,
  map: mapboxgl.Map | null,
): Promise<HeavydynProject> =>
  new Promise((resolve) => {
    createRoot((dispose) => {
      json = upgradeJSON(json)

      const units: HeavydynMathUnits = createHeavydynMathUnitsFromJSON(
        json.distinct.units,
      )

      const baseProject = createBaseProjectFromJSON(json.base, map, {
        reports: [] as HeavydynReport[],
        information: json.base.information,
        hardware: json.base.hardware,
        units,
      })

      const project: HeavydynProject = {
        ...baseProject,
        machine: 'Heavydyn',
        calibrations: {
          date: new Date(json.distinct.calibrations.date),
          dPlate: json.distinct.calibrations.dPlate,
          channels: json.distinct.calibrations.channels,
          sensors: json.distinct.calibrations.sensors,
        },
        correctionParameters: createHeavydynProjectCorrectionParametersFromJSON(
          json.distinct.correctionParameters,
          units,
        ),
        dispose() {
          this.reports
            .list()
            .forEach((report) =>
              report.zones().forEach((zone) => zone.dispose()),
            )

          dispose()
        },
        owner: getOwner(),
        toJSON(): JSONHeavydynProject {
          return {
            version: json.version,
            machine: 'Heavydyn',
            base: this.toBaseJSON(),
            distinct: {
              version: json.distinct.version,
              calibrations: json.distinct.calibrations,
              units: this.units.toJSON(),
              correctionParameters: this.correctionParameters.toJSON(),
            },
          }
        },
      }

      void batch(() => {
        const reports = json.base.reports.list.map((report) =>
          createHeavydynReportFromJSON(report as JSONHeavydynReport, map, {
            project,
          }),
        )

        project.reports.list.set(reports)

        project.reports.selectIndex(json.base.reports.selectedIndex)
      })

      resolve(project)
    })
  })

const upgradeJSON = (json: JSONHeavydynProjectVAny): JSONHeavydynProject => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
