import { createHeavydynProjectFromJSON } from './heavydyn'
import { createMaxidynProjectFromJSON } from './maxidyn'
import { createMinidynProjectFromJSON } from './minidyn'

export * from './heavydyn'
export * from './maxidyn'
export * from './minidyn'

export const createMachineProjectFromJSON = async (
  json: JSONMachineProject,
  map: mapboxgl.Map | null,
) => {
  let project: MachineProject | null = null

  switch (json.machine) {
    case 'Heavydyn':
      project = await createHeavydynProjectFromJSON(json, map)
      break

    case 'Maxidyn':
      project = await createMaxidynProjectFromJSON(json, map)
      break

    case 'Minidyn':
      project = await createMinidynProjectFromJSON(json, map)
      break
  }

  return project
}
