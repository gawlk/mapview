import {
  createFieldFromJSON,
  createHeavydynReportFromJSON,
  createMathUnit,
  getSelectedFromIndexInList,
} from '/src/scripts'

import { createBaseProjectFromJSON } from '../base'

export const createHeavydynProjectFromJSON = async (
  json: JSONHeavydynProjectVAny,
  map: mapboxgl.Map | null
) => {
  json = upgradeJSON(json)

  const jsonUnits = json.distinct.units

  const units: HeavydynMathUnits = {
    deflection: createMathUnit('Deflection', jsonUnits.deflection, 'm', [
      ['mm', 0],
      ['1/100 mm', 0],
      ['um', 0],
    ]),
    force: createMathUnit('Force', jsonUnits.force, 'N', [
      ['N', 0],
      ['kN', 0],
      ['lbs', 0],
    ]),
    temperature: createMathUnit('Temperature', jsonUnits.temperature, '°C', [
      ['°C', 0],
      ['°F', 0],
      ['K', 0],
    ]),
    distance: createMathUnit('Distance', jsonUnits.distance, 'm', [
      ['m', 0],
      ['km', 0],
      ['mi', 0],
    ]),
    time: createMathUnit(
      'Time',
      jsonUnits.time,
      's',
      [
        ['s', 0],
        ['ms', 0],
        ['us', 0],
      ],
      {
        step: 0.1,
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

  project.reports.selected = getSelectedFromIndexInList(
    json.base.reports.selected,
    project.reports.list
  )

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
      version: json.version,
      base: project.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
        calibrations: json.distinct.calibrations,
        units: {
          deflection: project.units.deflection.toJSON(),
          distance: project.units.distance.toJSON(),
          force: project.units.force.toJSON(),
          temperature: project.units.temperature.toJSON(),
          time: project.units.time.toJSON(),
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
