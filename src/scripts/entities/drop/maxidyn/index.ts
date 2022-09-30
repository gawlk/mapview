import { createBaseDropFromJSON } from '../base'

export const createMaxidynDropFromJSON = (
  json: JSONDrop,
  parameters: MaxidynDropCreatorParameters
) => {
  const drop: PartialMachineDrop<MaxidynDrop> = createBaseDropFromJSON(json, {
    machine: 'Maxidyn',
    ...parameters,
  })

  return drop as MaxidynDrop
}

export const createMaxidynDropIndexFromJSON = (
  json: JSONMaxidynDropIndex
): MaxidynDropIndex => {
  return {
    ...json,
    machine: 'Maxidyn',
  }
}
