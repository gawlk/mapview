import { createBaseDropFromJSON, createBaseDropIndexFromJSON } from '../base'

interface MinidynDropCreatorParameters extends MachineDropCreatorParameters {
  point: MinidynPoint
}

export const createMinidynDropFromJSON = (
  json: JSONMinidynDropVAny,
  parameters: MinidynDropCreatorParameters
) => {
  json = upgradeJSONDrop(json)

  const drop: PartialMachineDrop<MinidynDrop> = createBaseDropFromJSON(
    json.base,
    {
      machine: 'Minidyn',
      ...parameters,
    }
  )

  drop.toJSON = function (): JSONMinidynDrop {
    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.distinct.version,
      },
    }
  }

  return drop as MinidynDrop
}

const upgradeJSONDrop = (json: JSONMinidynDropVAny): JSONMinidynDrop => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMinidynDrop
  }

  return json
}

export const createMinidynDropIndexFromJSON = (
  json: JSONMinidynDropIndexVAny
): MinidynDropIndex => {
  json = upgradeJSONDropIndex(json)

  return {
    machine: 'Minidyn',
    ...createBaseDropIndexFromJSON(json.base),
    type: json.distinct.type,
    toJSON: function (): JSONMinidynDropIndex {
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
  json: JSONMinidynDropIndexVAny
): JSONMinidynDropIndex => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMinidynDropIndex
  }

  return json
}
