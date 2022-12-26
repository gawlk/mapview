import store from '/src/store'

import {
  createHeavydynProjectFromJSON,
  createMaxidynProjectFromJSON,
  createMinidynProjectFromJSON,
} from '/src/scripts'

export const importProjectFromJSON = async (
  json: JSONMachineProject
): Promise<MachineProject | null> => {
  const map = store.map as mapboxgl.Map

  let project = null

  switch (json.machine) {
    case 'Heavydyn':
      project = await createHeavydynProjectFromJSON(
        json as JSONHeavydynProject,
        map
      )
      break

    case 'Maxidyn':
      project = await createMaxidynProjectFromJSON(
        json as JSONMaxidynProject,
        map
      )
      break

    case 'Minidyn':
      project = await createMinidynProjectFromJSON(
        json as JSONMinidynProject,
        map
      )
      break
  }

  if (project) {
    store.projects.list.push(project)
  }

  return project
}
