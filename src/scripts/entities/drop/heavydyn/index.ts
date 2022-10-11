import { createBaseDropFromJSON, createBaseDropIndexFromJSON } from '../base'
import { createMathNumber } from '/src/scripts'

interface HeavydynDropCreatorParameters extends MachineDropCreatorParameters {
  point: HeavydynPoint
}

export const createHeavydynDropFromJSON = (
  json: JSONHeavydynDropVAny,
  parameters: HeavydynDropCreatorParameters
) => {
  json = upgradeJSONDrop(json)

  const drop: PartialMachineDrop<HeavydynDrop> = createBaseDropFromJSON(
    json.base,
    {
      machine: 'Heavydyn',
      ...parameters,
    }
  )

  drop.toJSON = (): JSONHeavydynDrop => {
    return {
      ...json,
      base: drop.toBaseJSON(),
      distinct: {
        ...json.distinct,
      },
    }
  }

  return drop as HeavydynDrop
}

const upgradeJSONDrop = (json: JSONHeavydynDropVAny): JSONHeavydynDrop => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONHeavydynDrop
  }

  return json
}

export const createHeavydynDropIndexFromJSON = (
  json: JSONHeavydynDropIndex,
  parameters: {
    project: HeavydynProject
  }
): HeavydynDropIndex => {
  json = upgradeJSONDropIndex(json)

  const unitName = json.distinct.unit.toLocaleLowerCase()

  return {
    ...createBaseDropIndexFromJSON(json.base),
    ...json.distinct,
    machine: 'Heavydyn',
    value: createMathNumber(
      json.distinct.value,
      unitName in parameters.project.units
        ? parameters.project.units[unitName as keyof HeavydynMathUnits]
        : unitName
    ),
  }
}

const upgradeJSONDropIndex = (
  json: JSONHeavydynDropIndexVAny
): JSONHeavydynDropIndex => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONHeavydynDropIndex
  }

  return json
}
