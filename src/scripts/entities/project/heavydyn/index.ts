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

  const units = [
    createMathUnit(
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
    createMathUnit(
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
    createMathUnit(
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
  ]

  const project: PartialMachineProject<HeavydynProject> =
    await createBaseProjectFromJSON(json, map, {
      machine: 'heavydyn',
      units,
      createFieldFromJSON: createHeavydynFieldFromJSON,
      createReportFromJSON: createHeavydynReportFromJSON,
    })

  return project as HeavydynProject
}
