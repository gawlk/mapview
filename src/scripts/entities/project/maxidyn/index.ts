import { createBaseProjectFromJSON } from '../base'
import {
  createMathUnit,
  createMaxidynFieldFromJSON,
  createMaxidynReportFromJSON,
} from '/src/scripts'

export const createMaxidynProjectFromJSON = async (
  json: JSONMaxidynProjectVAny,
  map: mapboxgl.Map | null
) => {
  json = upgradeJSON(json)

  const jsonUnits = json.distinct.units as JSONMaxidynUnits

  const units: MaxidynMathUnits = {
    modulus: createMathUnit('Modulus', 'Pa', [['MPa', 0]], {
      min: json.distinct.bearingParameters.min || 20000000,
      max: json.distinct.bearingParameters.max || 250000000,
      currentUnit: jsonUnits.modulus,
      averageFunction: 'capOutliers',
    }),
    stiffness: createMathUnit('Stiffness', 'N / m', [['MN / m', 0]], {
      currentUnit: jsonUnits.stiffness,
      averageFunction: 'capOutliers',
    }),
    deflection: createMathUnit(
      'Deflection',
      'm',
      [
        ['mm', 0],
        ['um', 0],
      ],
      {
        currentUnit: jsonUnits.deflection,
      }
    ),
    force: createMathUnit(
      'Force',
      'N',
      [
        ['N', 0],
        ['kN', 0],
      ],
      {
        currentUnit: jsonUnits.force,
      }
    ),
    distance: createMathUnit(
      'Distance',
      'm',
      [
        ['m', 0],
        ['km', 0],
        ['mi', 0],
      ],
      {
        currentUnit: jsonUnits.distance,
      }
    ),
    time: createMathUnit(
      'Time',
      's',
      [
        ['s', 0],
        ['ms', 0],
        ['us', 0],
      ],
      {
        currentUnit: jsonUnits.time,
      }
    ),
    percentage: createMathUnit('Percentage', '%', [['%', 0]], {
      currentUnit: '%',
      max: 100,
      step: 0.5,
      readOnly: true,
    }),
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

  project.reports.selected = project.reports.list[0]

  project.information.push(
    ...json.base.information.map((field: JSONBaseField) =>
      createMaxidynFieldFromJSON(field)
    )
  )

  project.hardware.push(
    ...json.base.hardware.map((field: JSONBaseField) =>
      createMaxidynFieldFromJSON(field)
    )
  )

  project.toJSON = function (): JSONMaxidynProject {
    const project = this as MaxidynProject

    return {
      ...json,
      base: project.toBaseJSON(),
      distinct: {
        ...json.distinct,
        units: {
          deflection: project.units.deflection.toJSON().unit,
          distance: project.units.distance.toJSON().unit,
          force: project.units.force.toJSON().unit,
          modulus: project.units.modulus.toJSON().unit,
          percentage: project.units.percentage.toJSON().unit,
          stiffness: project.units.stiffness.toJSON().unit,
          time: project.units.time.toJSON().unit,
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
