import { createBaseProjectFromJSON } from '../base'
import {
  createMathUnit,
  createMinidynFieldFromJSON,
  createMinidynReportFromJSON,
} from '/src/scripts'

export const createMinidynProjectFromJSON = async (
  json: JSONProject,
  map: mapboxgl.Map
) => {
  const jsonUnits = json.units as JSONMinidynUnits

  const units: MinidynMathUnits = {
    modulus: createMathUnit<PossibleMinidynModulusUnits>(
      'Modulus',
      'Pa',
      [['MPa', 0]],
      {
        currentUnit: jsonUnits.modulus,
      }
    ),
    stiffness: createMathUnit<PossibleMinidynStiffnessUnits>(
      'Stiffness',
      'N / m',
      [['MN / m', 0]],
      {
        currentUnit: jsonUnits.stiffness,
      }
    ),
    deflection: createMathUnit<PossibleMinidynDeflectionUnits>(
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
    load: createMathUnit<PossibleMinidynForceUnits>(
      'Load',
      'N',
      [
        ['N', 0],
        ['kN', 0],
      ],
      {
        currentUnit: jsonUnits.load,
      }
    ),
    temperature: createMathUnit<PossibleMinidynTemperatureUnits>(
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
    time: createMathUnit<PossibleMinidynTimeUnits>(
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
  }

  const project: PartialMachineProject<MinidynProject> =
    await createBaseProjectFromJSON(json, map, {
      machine: 'Minidyn',
      units,
    })

  project.reports.list.push(
    ...json.reports.map((report) =>
      createMinidynReportFromJSON(report, map, {
        projectSettings: json.settings,
        units,
      })
    )
  )

  project.reports.selected = project.reports.list[0]

  project.informations.push(
    ...json.informations.map((field: JSONField) =>
      createMinidynFieldFromJSON(field)
    )
  )

  project.hardware.push(
    ...json.hardware.map((field: JSONField) =>
      createMinidynFieldFromJSON(field)
    )
  )

  return project as MinidynProject
}
