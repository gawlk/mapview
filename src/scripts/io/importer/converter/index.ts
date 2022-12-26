import {
  convertPRJZToBaseProject,
  convertPRJZToHeavydynProject,
  convertPRJZToMaxidynProject,
  convertPRJZToMinidynProject,
} from './project'

export const convertJSONFromPRJZToMPVZ = (json: any) => {
  const machine =
    json.Database.Software === 'Fwddyn'
      ? 'Heavydyn'
      : json.Hardware.Serial.split('-')[0] === 'MAX'
      ? 'Maxidyn'
      : 'Minidyn'

  const baseProject = convertPRJZToBaseProject(json, machine)

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
