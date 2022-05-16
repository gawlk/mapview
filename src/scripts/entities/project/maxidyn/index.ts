import { createBaseProjectFromJSON } from '../base'
import {
  createMathUnit,
  createMaxidynFieldFromJSON,
  createMaxidynReportFromJSON,
} from '/src/scripts'

export const createMaxidynProjectFromJSON = async (
  json: JSONProject,
  map: mapboxgl.Map | null
) => {
  const jsonUnits = json.units as JSONMaxidynUnits

  const units: MaxidynMathUnits = {
    modulus: createMathUnit<PossibleMaxidynModulusUnits>(
      'Modulus',
      'Pa',
      [['MPa', 0]],
      {
        currentUnit: jsonUnits.modulus,
      }
    ),
    stiffness: createMathUnit<PossibleMaxidynStiffnessUnits>(
      'Stiffness',
      'N / m',
      [['MN / m', 0]],
      {
        currentUnit: jsonUnits.stiffness,
      }
    ),
    deflection: createMathUnit<PossibleMaxidynDeflectionUnits>(
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
    load: createMathUnit<PossibleMaxidynForceUnits>(
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
    distance: createMathUnit<PossibleMaxidynDistanceUnits>(
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
    time: createMathUnit<PossibleMaxidynTimeUnits>(
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

  const project: PartialMachineProject<MaxidynProject> =
    await createBaseProjectFromJSON(json, map, {
      machine: 'Maxidyn',
      units,
    })

  project.reports.list.push(
    ...json.reports.map((report) =>
      createMaxidynReportFromJSON(report, map, {
        project: project as MaxidynProject,
      })
    )
  )

  project.reports.selected = project.reports.list[0]

  project.informations.push(
    ...json.informations.map((field: JSONField) =>
      createMaxidynFieldFromJSON(field)
    )
  )

  project.hardware.push(
    ...json.hardware.map((field: JSONField) =>
      createMaxidynFieldFromJSON(field)
    )
  )

  return project as MaxidynProject
}
