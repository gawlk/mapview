import {
  createFieldFromJSON,
  createMinidynMathUnitsFromJSON,
  createMinidynReportFromJSON,
} from '/src/scripts'

import { createBaseProjectFromJSON } from '../base'

export const createMinidynProjectFromJSON = (
  json: JSONMinidynProjectVAny,
  map: mapboxgl.Map | null
) => {
  json = upgradeJSON(json)

  const units = createMinidynMathUnitsFromJSON(json.distinct.units)

  const baseProject = createBaseProjectFromJSON(json.base, map, {
    reports: [] as MinidynReport[],
    units,
    information: json.base.information,
    hardware: json.base.hardware,
  })

  const project: MinidynProject = shallowReactive({
    ...baseProject,
    machine: 'Minidyn',
    bearingParameters: shallowReactive(json.distinct.bearingParameters),
    toJSON: function (): JSONMinidynProject {
      return {
        version: json.version,
        machine: 'Minidyn',
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
          bearingParameters: json.distinct.bearingParameters,
          units: {
            deflection: this.units.deflection.toJSON(),
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
      createMinidynReportFromJSON(report as JSONMinidynReport, map, {
        project: project as MinidynProject,
      })
    )
  )

  project.reports.selectIndex(json.base.reports.selectedIndex)

  return project
}

const upgradeJSON = (json: JSONMinidynProjectVAny): JSONMinidynProject => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMinidynProject
  }

  return json
}
