import { createBaseDropFromJSON } from '../base'

export const createMaxidynDropFromJSON = (
  json: JSONDrop,
  parameters: HeavydynDropCreatorParameters
) => {
  const drop: PartialMachineDrop<MaxidynDrop> = createBaseDropFromJSON(json, {
    machine: 'maxidyn',
    ...parameters,
  })

  return drop as MaxidynDrop
}
