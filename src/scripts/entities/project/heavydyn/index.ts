import { createBaseProjectFromJSON } from '../base'
import {
  createMathUnit,
  createHeavydynFieldFromJSON,
  createHeavydynReportFromJSON,
} from '/src/scripts'

export const createHeavydynProjectFromJSON = async (
  json: JSONProject,
  map: mapboxgl.Map
) => {
  const jsonUnits = json.units as JSONHeavydynUnits

  const units: HeavydynUnits = {
    deformation: createMathUnit(
      'Deformation',
      [
        ['mm', 0],
        ['1/100 mm', 0],
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
        ['lbs', 0],
      ],
      {
        currentUnit: jsonUnits.force,
      }
    ),
    temperature: createMathUnit(
      'Temperature',
      [
        ['°C', 0],
        ['°F', 0],
        ['K', 0],
      ],
      {
        currentUnit: jsonUnits.temperature,
      }
    ),
  }

  const project: PartialMachineProject<HeavydynProject> =
    await createBaseProjectFromJSON(json, map, {
      machine: 'heavydyn',
      units,
    })

  project.reports.list.push(
    ...json.reports.map((report) =>
      createHeavydynReportFromJSON(report, map, {
        projectSettings: json.settings,
        units,
      })
    )
  )

  project.informations.push(
    ...json.informations.map((field: JSONField) =>
      createHeavydynFieldFromJSON(field)
    )
  )

  return project as HeavydynProject
}
