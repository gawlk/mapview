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

  const units: HeavydynMathUnits = {
    deflection: createMathUnit<PossibleHeavydynDeflectionUnits>(
      'Deflection',
      'm',
      [
        ['mm', 0],
        ['1/100 mm', 0],
        ['um', 0],
      ],
      {
        max: 0.003,
        currentUnit: jsonUnits.deflection,
      }
    ),
    force: createMathUnit<PossibleHeavydynForceUnits>(
      'Force',
      'N',
      [
        ['N', 0],
        ['kN', 0],
        ['lbs', 0],
      ],
      {
        max: 500000,
        currentUnit: jsonUnits.force,
      }
    ),
    temperature: createMathUnit<PossibleHeavydynTemperatureUnits>(
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
    distance: createMathUnit<PossibleHeavydynDistanceUnits>(
      'Distance',
      'm',
      [
        ['m', 0],
        ['km', 0],
        ['mi', 0],
      ],
      {
        max: 100000,
        currentUnit: jsonUnits.distance,
      }
    ),
    time: createMathUnit<PossibleHeavydynTimeUnits>(
      'Time',
      's',
      [
        ['s', 0],
        ['ms', 0],
        ['us', 0],
      ],
      {
        max: 0.1,
        step: 0.1,
        currentUnit: jsonUnits.time,
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

  project.reports.selected = project.reports.list[0]

  project.informations.push(
    ...json.informations.map((field: JSONField) =>
      createHeavydynFieldFromJSON(field)
    )
  )

  return project as HeavydynProject
}
