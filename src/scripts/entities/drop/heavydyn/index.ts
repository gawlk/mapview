import { createBaseDropFromJSON } from '../base'

export const createHeavydynDropFromJSON = (
  json: JSONDrop,
  parameters: HeavydynDropCreatorParameters
) => {
  const drop: PartialMachineDrop<HeavydynDrop> = createBaseDropFromJSON(json, {
    machine: 'Heavydyn',
    ...parameters,
  })

  return drop as HeavydynDrop
}
