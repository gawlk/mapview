import { createBaseProjectFromJSON } from '../base'
import {
  createMathUnit,
  createFieldFromJSON,
  createMinidynReportFromJSON,
  getSelectedFromIndexInList,
} from '/src/scripts'

export const createMinidynProjectFromJSON = async (
  json: JSONMinidynProjectVAny,
  map: mapboxgl.Map | null
) => {
  json = upgradeJSON(json)

  const jsonUnits = json.distinct.units as JSONMinidynUnits

  const units: MinidynMathUnits = {
    modulus: createMathUnit('Modulus', jsonUnits.modulus, 'Pa', [['MPa', 0]], {
      averageFunction: 'capOutliers',
    }),
    stiffness: createMathUnit(
      'Stiffness',
      jsonUnits.stiffness,
      'N / m',
      [['MN / m', 0]],
      {
        averageFunction: 'capOutliers',
      }
    ),
    deflection: createMathUnit('Deflection', jsonUnits.deflection, 'm', [
      ['mm', 0],
      ['um', 0],
    ]),
    force: createMathUnit('Force', jsonUnits.force, 'N', [
      ['N', 0],
      ['kN', 0],
    ]),
    time: createMathUnit('Time', jsonUnits.time, 's', [
      ['s', 0],
      ['ms', 0],
      ['us', 0],
    ]),
    percentage: createMathUnit(
      'Percentage',
      {
        version: 1,
        currentUnit: '%',
        currentPrecision: 0,
        max: 100,
      },
      '%',
      [['%', 0]],
      {
        step: 0.5,
        readOnly: true,
      }
    ),
  }

  const project: PartialMachineProject<MinidynProject> =
    await createBaseProjectFromJSON(json.base, map, {
      machine: 'Minidyn',
      units,
    })

  project.reports.list.push(
    ...json.base.reports.list.map((report) =>
      createMinidynReportFromJSON(report as JSONMinidynReport, map, {
        project: project as MinidynProject,
      })
    )
  )

  project.reports.selected = getSelectedFromIndexInList(
    json.base.reports.selected,
    project.reports.list
  )

  project.information.push(
    ...json.base.information.map((field: JSONField) =>
      createFieldFromJSON(field)
    )
  )

  project.hardware.push(
    ...json.base.hardware.map((field: JSONField) => createFieldFromJSON(field))
  )

  project.toJSON = function (): JSONMinidynProject {
    const project = this as MinidynProject

    return {
      version: json.version,
      base: project.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
        bearingParameters: json.distinct.bearingParameters,
        units: {
          deflection: project.units.deflection.toJSON(),
          force: project.units.force.toJSON(),
          modulus: project.units.modulus.toJSON(),
          percentage: project.units.percentage.toJSON(),
          stiffness: project.units.stiffness.toJSON(),
          time: project.units.time.toJSON(),
        },
      },
    }
  }

  return project as MinidynProject
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
