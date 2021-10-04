import { createBaseProject } from '../base'
import {
  createMathUnit,
  createMinidynField,
  createMinidynReport,
} from '/src/scripts'

export const createMinidynProject = async (
  json: JSONProject,
  map: mapboxgl.Map
) => {
  const project: PartialMachineProject<MinidynProject> =
    await createBaseProject(json, map, {
      kind: 'minidyn',
      units: [
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
          ['lbs', 0],
        ]),
        createMathUnit('Temperature', [
          ['degC', 0],
          ['degF', 0],
          ['K', 0],
        ]),
      ],
      createField: createMinidynField,
      createReport: createMinidynReport,
    })

  return project as MinidynProject
}
