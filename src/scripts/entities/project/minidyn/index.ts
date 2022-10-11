import { createBaseProjectFromJSON } from '../base'
import {
  createMathUnit,
  createFieldFromJSON,
  createMinidynReportFromJSON,
} from '/src/scripts'

export const createMinidynProjectFromJSON = async (
  json: JSONMinidynProjectVAny,
  map: mapboxgl.Map | null
) => {
  json = upgradeJSON(json)

  const jsonUnits = json.distinct.units as JSONMinidynUnits

  const units: MinidynMathUnits = {
    modulus: createMathUnit('Modulus', 'Pa', [['MPa', 0]], {
      min: json.distinct.bearingParameters.min || 10000000,
      max: json.distinct.bearingParameters.max || 150000000,
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
    temperature: createMathUnit(
      'Temperature',
      '°C',
      [
        ['°C', 0],
        ['°F', 0],
        ['K', 0],
      ],
      {
        currentUnit: jsonUnits.temperature,
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

  project.reports.selected = project.reports.list[0]

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
      ...json,
      base: project.toBaseJSON(),
      distinct: {
        ...json.distinct,
        units: {
          deflection: project.units.deflection.toJSON().unit,
          force: project.units.force.toJSON().unit,
          modulus: project.units.modulus.toJSON().unit,
          percentage: project.units.percentage.toJSON().unit,
          stiffness: project.units.stiffness.toJSON().unit,
          temperature: project.units.temperature.toJSON().unit,
          time: project.units.time.toJSON().unit,
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
