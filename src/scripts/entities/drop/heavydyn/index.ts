import { createBaseDropFromJSON, createBaseDropIndexFromJSON } from '../base'
import { createMathNumber } from '/src/scripts'

export const createHeavydynDropFromJSON = (
  json: JSONDrop,
  parameters: HeavydynDropCreatorParameters
) => {
  const drop: PartialMachineDrop<HeavydynDrop> = createBaseDropFromJSON(json, {
    machine: 'Heavydyn',
    ...parameters,
  })

  return drop as HeavydynDrop
}

export const createHeavydynDropIndexFromJSON = (
  json: JSONHeavydynDropIndex,
  parameters: {
    project: HeavydynProject
  }
): HeavydynDropIndex => {
  const unitName = json.unit.toLocaleLowerCase()

  return {
    ...createBaseDropIndexFromJSON(json),
    machine: 'Heavydyn',
    type: json.type,
    value: createMathNumber(
      json.value,
      unitName in parameters.project.units
        ? parameters.project.units[unitName as keyof HeavydynMathUnits]
        : unitName
    ),
  }
}
