import { createBaseDropFromJSON } from '../base'

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

  drop.toJSON = (): JSONMaxidynDrop => {
    return {
      ...json,
      base: drop.toBaseJSON(),
      distinct: {
        ...json.distinct,
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
    ...json.base,
    ...json.distinct,
    machine: 'Maxidyn',
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
