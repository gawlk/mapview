import { createMathNumber } from '/src/scripts'

import { createBaseDropFromJSON, createBaseDropIndexFromJSON } from '../base'

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
      point: parameters.point,
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
      parameters.project.units[unitName as keyof HeavydynMathUnits]
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
