import { createBaseDropFromJSON } from '../base'

export const createMinidynDropFromJSON = (
  json: JSONDrop,
  parameters: MinidynDropCreatorParameters
) => {
  const drop: PartialMachineDrop<MinidynDrop> = createBaseDropFromJSON(json, {
    machine: 'minidyn',
    ...parameters,
  })

  return drop as MinidynDrop
}
