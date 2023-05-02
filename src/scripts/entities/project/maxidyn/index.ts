import {
  createMaxidynMathUnitsFromJSON,
  createMaxidynReportFromJSON,
} from '/src/scripts'

import { createBaseProjectFromJSON } from '../base'

export const createMaxidynProjectFromJSON = (
  json: JSONMaxidynProjectVAny,
  map: mapboxgl.Map | null
) => {
  json = upgradeJSON(json)

  const units = createMaxidynMathUnitsFromJSON(json.distinct.units)

  const baseProject = createBaseProjectFromJSON(json.base, map, {
    reports: [] as MaxidynReport[],
    units,
    information: json.base.information,
    hardware: json.base.hardware,
  })

  const project: MaxidynProject = shallowReactive({
    ...baseProject,
    machine: 'Maxidyn',
    bearingParameters: shallowReactive(json.distinct.bearingParameters),
    toJSON(): JSONMaxidynProject {
      return {
        version: json.version,
        machine: 'Maxidyn',
        base: project.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
          bearingParameters: json.distinct.bearingParameters,
          units: {
            version: 1,
            deflection: this.units.deflection.toJSON(),
            distance: this.units.distance.toJSON(),
            force: this.units.force.toJSON(),
            modulus: this.units.modulus.toJSON(),
            percentage: this.units.percentage.toJSON(),
            stiffness: this.units.stiffness.toJSON(),
            time: this.units.time.toJSON(),
          },
        },
      }
    },
  })

  project.reports.list.push(
    ...json.base.reports.list.map((report) =>
      createMaxidynReportFromJSON(report as JSONMaxidynReport, map, {
        project,
      })
    )
  )

  project.reports.selectIndex(json.base.reports.selectedIndex)

  return project
}

const upgradeJSON = (json: JSONMaxidynProjectVAny): JSONMaxidynProject => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
