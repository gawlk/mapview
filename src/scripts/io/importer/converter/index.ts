import {
  convertPRJZToBaseProject,
  convertPRJZToHeavydynProject,
  convertPRJZToMaxidynProject,
  convertPRJZToMinidynProject,
} from './project'

export const convertJSONFromPRJZToMPVZ = (json: RecordAny) => {
  let machine: MachineName = 'Minidyn'

  const pcb = Object.keys(json.Hardware).find((key) =>
    key.toLowerCase().includes('TypeMachinePCB'.toLowerCase()),
  )

  if (pcb) {
    switch (json.Hardware[pcb]) {
      case 0xa981c52c:
      case 0x0e418beb:
      case 0xb0a4cf72:
      case 0x3b599706: {
        machine = 'Maxidyn'
        break
      }
      case 0x7b33a869:
      case 0xe37d6725:
      case 0x5b2c3a47: {
        machine = 'Heavydyn'
        break
      }
    }
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
