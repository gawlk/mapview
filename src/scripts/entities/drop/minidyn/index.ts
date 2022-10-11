import { createBaseDropFromJSON } from '../base'

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

  drop.toJSON = (): JSONMinidynDrop => {
    return {
      ...json,
      base: drop.toBaseJSON(),
      distinct: {
        ...json.distinct,
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
    ...json.base,
    ...json.distinct,
    machine: 'Minidyn',
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
