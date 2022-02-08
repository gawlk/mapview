import { createBaseProjectFromJSON } from '../base'
import {
  createMathUnit,
  createMaxidynFieldFromJSON,
  createMaxidynReportFromJSON,
} from '/src/scripts'

export const createMaxidynProjectFromJSON = async (
  json: JSONProject,
  map: mapboxgl.Map
) => {
  const jsonUnits = json.units as JSONMaxidynUnits

  const units = [
    createMathUnit(
      'Modulus',
      [
        ['MPa', 0],
        ['kN', 0],
      ],
      {
        currentUnit: jsonUnits.modulus,
      }
    ),
    createMathUnit(
      'Deformation',
      [
        ['mm', 0],
        ['um', 0],
      ],
      {
        minDisplayedValue: 100,
        maxDisplayedValue: 200,
        currentUnit: jsonUnits.deformation,
      }
    ),
    createMathUnit(
      'Force',
      [
        ['N', 0],
        ['kN', 0],
      ],
      {
        currentUnit: jsonUnits.force,
      }
    ),
  ]

  const project: PartialMachineProject<MaxidynProject> =
    await createBaseProjectFromJSON(json, map, {
      machine: 'maxidyn',
      units,
      createFieldFromJSON: createMaxidynFieldFromJSON,
      createReportFromJSON: createMaxidynReportFromJSON,
    })

  return project as MaxidynProject
}
