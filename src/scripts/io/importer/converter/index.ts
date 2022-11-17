import {
  convertPRJZToBaseProject,
  convertPRJZToHeavydynProject,
  convertPRJZToMaxidynProject,
  convertPRJZToMinidynProject,
} from './project'

export const convertJSONFromPRJZToMPVZ = (json: any) => {
  const baseProject = convertPRJZToBaseProject(json)
  const machine = baseProject.machine

  switch (machine) {
    case 'Heavydyn': {
      return convertPRJZToHeavydynProject(json, baseProject)
    }
    case 'Maxidyn': {
      return convertPRJZToMaxidynProject(json, baseProject)
    }
    case 'Minidyn': {
      return convertPRJZToMinidynProject(json, baseProject)
    }
  }
}
