import { createBaseProjectFromJSON } from '../base'
import {
  createMathUnit,
  createFieldFromJSON,
  createMaxidynReportFromJSON,
  getSelectedFromIndexInList,
} from '/src/scripts'

export const createMaxidynProjectFromJSON = async (
  json: JSONMaxidynProjectVAny,
  map: mapboxgl.Map | null
) => {
  json = upgradeJSON(json)

  const jsonUnits = json.distinct.units as JSONMaxidynUnits

  const units: MaxidynMathUnits = {
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
    distance: createMathUnit('Distance', jsonUnits.distance, 'm', [
      ['m', 0],
      ['km', 0],
      ['mi', 0],
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

  const project: PartialMachineProject<MaxidynProject> =
    await createBaseProjectFromJSON(json.base, map, {
      machine: 'Maxidyn',
      units,
    })

  project.reports.list.push(
    ...json.base.reports.list.map((report) =>
      createMaxidynReportFromJSON(report as JSONMaxidynReport, map, {
        project: project as MaxidynProject,
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

  project.toJSON = function (): JSONMaxidynProject {
    const project = this as MaxidynProject

    return {
      version: json.version,
      base: project.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
        bearingParameters: json.distinct.bearingParameters,
        units: {
          deflection: project.units.deflection.toJSON(),
          distance: project.units.distance.toJSON(),
          force: project.units.force.toJSON(),
          modulus: project.units.modulus.toJSON(),
          percentage: project.units.percentage.toJSON(),
          stiffness: project.units.stiffness.toJSON(),
          time: project.units.time.toJSON(),
        },
      },
    }
  }

  return project as MaxidynProject
}

const upgradeJSON = (json: JSONMaxidynProjectVAny): JSONMaxidynProject => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMaxidynProject
  }

  return json
}
