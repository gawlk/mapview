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

  const units: MaxidynUnits = {
    modulus: createMathUnit(
      'Modulus',
      [
        ['MPa', 0],
        ['kN', 0],
      ],
      {
        currentUnit: jsonUnits.modulus,
      }
    ),
    deformation: createMathUnit(
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
    force: createMathUnit(
      'Force',
      [
        ['N', 0],
        ['kN', 0],
      ],
      {
        currentUnit: jsonUnits.force,
      }
    ),
  }

  const project: PartialMachineProject<MaxidynProject> =
    await createBaseProjectFromJSON(json, map, {
      machine: 'maxidyn',
      units,
    })

  project.reports.list.push(
    ...json.reports.map((report) =>
      createMaxidynReportFromJSON(report, map, {
        projectSettings: json.settings,
        units,
      })
    )
  )

  project.informations.push(
    ...json.informations.map((field: JSONField) =>
      createMaxidynFieldFromJSON(field)
    )
  )

  return project as MaxidynProject
}
