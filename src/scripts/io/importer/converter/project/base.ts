import { run } from '/src/scripts'

import { convertPRJZObjectToFields } from '../shared'

export const convertPRJZToBaseProject = (
  json: any,
  machine: MachineName
): JSONBaseProject => {
  return {
    version: 1,
    name: json.Project.Name,
    settings: {
      version: 1,
      arePointsLinked: run(() => {
        switch (machine) {
          case 'Heavydyn':
            return true
          default:
            return false
        }
      }),
      arePointsVisible: true,
      areOverlaysVisible: true,
      pointsState: 'number',
      map: {
        version: 1,
        styleIndex: 0,
      },
    },
    overlays: [],
    information: [...convertPRJZObjectToFields(json.Project)],
    hardware: convertPRJZObjectToFields(json.Hardware, {
      version: 1,
      readOnly: true,
    }),
    acquisitionParameters: {
      version: 1,
      nbSamples: json.ParamsAcqu.NbSamples,
      frequency: json.ParamsAcqu.FreqAcqu,
      preTrig: json.ParamsAcqu.PreTrig,
      ...('Smoothing' in json.ParamsAcqu
        ? { smoothing: json.ParamsAcqu.Smoothing }
        : {}),
    },
    reports: {
      version: 1,
      selectedIndex: null,
      list: [],
    },
  }
}
