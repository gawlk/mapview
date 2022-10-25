import { createBaseDropFromJSON, createBaseDropIndexFromJSON } from '../base'

interface MaxidynDropCreatorParameters extends MachineDropCreatorParameters {
  point: MaxidynPoint
}

export const createMaxidynDropFromJSON = (
  json: JSONMaxidynDropVAny,
  parameters: MaxidynDropCreatorParameters
) => {
  json = upgradeJSONDrop(json)

  const drop: PartialMachineDrop<MaxidynDrop> = createBaseDropFromJSON(
    json.base,
    {
      machine: 'Maxidyn',
      ...parameters,
    }
  )

  drop.toJSON = function (): JSONMaxidynDrop {
    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
      },
    }
  }

  return drop as MaxidynDrop
}

const upgradeJSONDrop = (json: JSONMaxidynDropVAny): JSONMaxidynDrop => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMaxidynDrop
  }

  return json
}

export const createMaxidynDropIndexFromJSON = (
  json: JSONMaxidynDropIndex
): MaxidynDropIndex => {
  json = upgradeJSONDropIndex(json)

  return {
    machine: 'Maxidyn',
    ...createBaseDropIndexFromJSON(json.base),
    type: json.distinct.type,
    toJSON: function (): JSONMaxidynDropIndex {
      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
          type: json.distinct.type,
        },
      }
    },
  }
}

const upgradeJSONDropIndex = (
  json: JSONMaxidynDropIndexVAny
): JSONMaxidynDropIndex => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMinidynDropIndex
  }

  return json
}
