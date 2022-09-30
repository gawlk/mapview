import { createBaseDropFromJSON } from '../base'

export const createMinidynDropFromJSON = (
  json: JSONDrop,
  parameters: MinidynDropCreatorParameters
) => {
  const drop: PartialMachineDrop<MinidynDrop> = createBaseDropFromJSON(json, {
    machine: 'Minidyn',
    ...parameters,
  })

  return drop as MinidynDrop
}

export const createMinidynDropIndexFromJSON = (
  json: JSONMinidynDropIndex
): MinidynDropIndex => {
  return {
    ...json,
    machine: 'Minidyn',
  }
}
