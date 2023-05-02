import {
  convertPRJZToBaseProject,
  convertPRJZToHeavydynProject,
  convertPRJZToMaxidynProject,
  convertPRJZToMinidynProject,
} from './project'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertJSONFromPRJZToMPVZ = (json: any) => {
  let machine: MachineName = 'Minidyn'

  if (json.Database.Software === 'Fwddyn') {
    machine = 'Heavydyn'
  } else if (json.Hardware.Serial.split('-')[0] === 'MAX') {
    machine = 'Maxidyn'
  }

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
