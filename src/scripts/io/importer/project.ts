import { store } from '/src/store'

import {
  createHeavydynProjectFromJSON,
  createMaxidynProjectFromJSON,
  createMinidynProjectFromJSON,
} from '/src/scripts'

export const importProjectFromJSON = (
  json: JSONMachineProject,
): MachineProject => {
  const map = store.map as mapboxgl.Map

  let project = null

  switch (json.machine) {
    case 'Heavydyn':
      project = createHeavydynProjectFromJSON(json, map)
      break

    case 'Maxidyn':
      project = createMaxidynProjectFromJSON(json, map)
      break

    case 'Minidyn':
      project = createMinidynProjectFromJSON(json, map)
      break
  }

  if (project) {
    store.projects.list.push(project)
  }

  return project
}
