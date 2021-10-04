import { createBaseProject } from '../base'
import { createMaxidynField } from '/src/scripts'

export const createMaxidynProject = async (
  json: JSONProject,
  map: mapboxgl.Map
) => {
  const project: PartialMachineProject<MaxidynProject> =
    await createBaseProject(json, map, {
      kind: 'maxidyn',
      units: [],
      createField: createMaxidynField,
    })

  return project as MaxidynProject
}
