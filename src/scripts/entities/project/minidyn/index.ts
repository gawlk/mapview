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
        thresholds: [
          {
            name: 'N.S',
            value: 0,
          },
          {
            name: 'AR1',
            value: 20,
          },
          {
            name: 'AR2',
            value: 50,
          },
          {
            name: 'AR3',
            value: 120,
          },
          {
            name: 'AR4',
            value: 200,
          },
          {
            name: 'PF1',
            value: 20,
          },
          {
            name: 'PF2',
            value: 50,
          },
          {
            name: 'PF2+',
            value: 80,
          },
          {
            name: 'PF3',
            value: 120,
          },
          {
            name: 'PF4',
            value: 200,
          },
        ],
      }
    ),
    createMathUnit('Force', [
      ['N', 0],
      ['kN', 0],
    ]),
    createMathUnit('Temperature', [
      ['°C', 0],
      ['°F', 0],
      ['K', 0],
    ]),
  ]

  const project: PartialMachineProject<MinidynProject> =
    await createBaseProjectFromJSON(json, map, {
      machine: 'minidyn',
      units,
      createFieldFromJSON: createMinidynFieldFromJSON,
      createReportFromJSON: createMinidynReportFromJSON,
    })

  return project as MinidynProject
}
