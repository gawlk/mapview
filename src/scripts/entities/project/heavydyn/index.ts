import { createBaseProjectFromJSON } from '../base'
import {
  createMathUnit,
  createFieldFromJSON,
  createHeavydynReportFromJSON,
} from '/src/scripts'

export const createHeavydynProjectFromJSON = async (
  json: JSONHeavydynProjectVAny,
  map: mapboxgl.Map | null
) => {
  json = upgradeJSON(json)

  const jsonUnits = json.distinct.units

  const units: HeavydynMathUnits = {
    deflection: createMathUnit(
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
    force: createMathUnit(
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
    distance: createMathUnit(
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
    time: createMathUnit(
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
    await createBaseProjectFromJSON(json.base, map, {
      machine: 'Heavydyn',
      units,
    })

  project.reports.list.push(
    ...json.base.reports.list.map((report) =>
      createHeavydynReportFromJSON(report as JSONHeavydynReport, map, {
        project: project as HeavydynProject,
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

  project.calibrations = {
    date: new Date(json.distinct.calibrations.date),
    dPlate: json.distinct.calibrations.dPlate,
    channels: json.distinct.calibrations.channels,
    sensors: json.distinct.calibrations.sensors,
  }

  project.toJSON = function (): JSONHeavydynProject {
    const project = this as HeavydynProject

    return {
      ...json,
      base: project.toBaseJSON(),
      distinct: {
        ...json.distinct,
        units: {
          deflection: project.units.deflection.toJSON().unit,
          distance: project.units.distance.toJSON().unit,
          force: project.units.force.toJSON().unit,
          temperature: project.units.temperature.toJSON().unit,
          time: project.units.time.toJSON().unit,
        },
      },
    }
  }

  return project as HeavydynProject
}

const upgradeJSON = (json: JSONHeavydynProjectVAny): JSONHeavydynProject => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONHeavydynProject
  }

  return json
}
