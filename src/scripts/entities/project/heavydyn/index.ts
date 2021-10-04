import { createBaseProject } from '../base'

import { createMathUnit, createHeavydynField } from '/src/scripts'

export const createHeavydynProject = async (
  json: JSONProject,
  map: mapboxgl.Map
) => {
  const unitDeformation = createMathUnit(
    'Deformation',
    [
      ['mm', 0],
      ['1/100 mm', 0],
      ['um', 0],
    ],
    {
      minDisplayedValue: 100,
      maxDisplayedValue: 200,
    }
  )

  const unitForce = createMathUnit('Force', [
    ['N', 0],
    ['kN', 0],
    ['lbs', 0],
  ])

  const unitTemperature = createMathUnit('Temperature', [
    ['degC', 0],
    ['degF', 0],
    ['K', 0],
  ])

  const project: PartialMachineProject<HeavydynProject> =
    await createBaseProject(json, map, {
      kind: 'heavydyn',
      units: [unitDeformation, unitForce, unitTemperature],
      createField: createHeavydynField,
    })

  return project as HeavydynProject
}
