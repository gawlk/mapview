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

  drop.toJSON = function (): JSONHeavydynDrop {
    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
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
    machine: 'Heavydyn',
    ...createBaseDropIndexFromJSON(json.base),
    type: json.distinct.type,
    value: createMathNumber(
      json.distinct.value,
      unitName in parameters.project.units
        ? parameters.project.units[unitName as keyof HeavydynMathUnits]
        : unitName
    ),
    toJSON: function (): JSONHeavydynDropIndex {
      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
          type: json.distinct.type,
          unit: json.distinct.unit,
          value: json.distinct.value,
        },
      }
    },
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
