import { convertPRJZObjectToFields } from '../shared'

export const convertPRJZToBaseProject = (json: any): JSONBaseProject => {
  const machine =
    json.Database.Software === 'Fwddyn'
      ? 'Heavydyn'
      : json.Hardware.Serial.split('-')[0] === 'MAX'
      ? 'Maxidyn'
      : 'Minidyn'

  return {
    version: 1,
    name: json.Project.Name,
    machine,
    settings: {
      version: 1,
      arePointsLinked: (() => {
        switch (machine) {
          case 'Heavydyn':
            return true
          default:
            return false
        }
      })(),
      arePointsLocked: true,
      arePointsVisible: true,
      areImagesVisible: true,
      pointsState: 'number',
      map: {
        version: 1,
        styleIndex: 0,
        coordinates: null,
        zoom: null,
      },
    },
    images: [],
    information: [...convertPRJZObjectToFields(json.Project)],
    hardware: convertPRJZObjectToFields(json.Hardware, {
      version: 1,
      readOnly: true,
    }),
    reports: {
      selected: null,
      list: [],
    },
  }
}
