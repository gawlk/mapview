import { icons } from '/src/scripts'

import { convertPRJZObjectToFields } from '../shared'

export const convertPRJZToBaseReport = (
  jsonPV: any,
  reportIndex: number,
  parameters: {
    machine: MachineName
    dropChoices: JSONDataLabel<string>[]
    dropIndexes: JSONMachineDropIndex[]
    testChoices: JSONDataLabel<string>[]
  }
): JSONBaseReport => {
  const iconsNames = Object.keys(icons) as IconName[]

  return {
    version: 1,
    name: jsonPV.PV.Name,
    settings: {
      version: 1,
      iconName: iconsNames[reportIndex % iconsNames.length],
      isVisible: true,
      colorization: 'Threshold',
      groupBy: 'Number',
    },
    thresholds: {
      version: 1,
      colors: (() => {
        return {
          version: 1,
          low: parameters.machine === 'Heavydyn' ? 'green' : 'red',
          middle: 'yellow',
          high: parameters.machine === 'Heavydyn' ? 'red' : 'green',
        }
      })(),
      inputs: {
        version: 1,
        isRequiredARange: true,
        isOptionalARange: true,
      },
    },
    zones: [
      {
        version: 1,
        base: {
          version: 1,
          name: 'Zone 1',
          settings: {
            version: 1,
            color: 'gray',
            isVisible: true,
          },
          points: [] as JSONMachinePoint[],
        },
        distinct: {
          version: 1,
        },
      },
    ],
    dataLabels: {
      version: 1,
      table: {
        version: 1,
        selectedIndex: parameters.machine === 'Heavydyn' ? 0 : 1,
        list: [
          {
            version: 1,
            from: 'Drop',
            index: parameters.dropIndexes.length - 1,
            dataLabels: ((): string[] => {
              switch (parameters.machine) {
                case 'Heavydyn':
                  return [
                    'Load',
                    ...(() => {
                      const indexD0 = parameters.dropChoices.findIndex(
                        (choice) => choice.name === 'D0'
                      )

                      return parameters.dropChoices
                        .map((choice) => choice.name)
                        .slice(indexD0, indexD0 + 3)
                    })(),
                  ]
                case 'Maxidyn':
                case 'Minidyn':
                  return parameters.dropChoices
                    .map((choice) => choice.name)
                    .filter(
                      (name) =>
                        name === 'Modulus' ||
                        name === 'Stiffness' ||
                        name === 'Quality'
                    )
              }
            })(),
          },
          {
            version: 1,
            from: 'Point',
            dataLabels: ((): string[] => {
              switch (parameters.machine) {
                case 'Heavydyn':
                  return parameters.testChoices.map((choice) => choice.name)
                case 'Maxidyn':
                case 'Minidyn':
                  return parameters.testChoices
                    .map((choice) => choice.name)
                    .filter(
                      (name) =>
                        name === 'Modulus' ||
                        name === 'Stiffness' ||
                        name === 'Quality'
                    )
              }
            })(),
          },
          {
            version: 1,
            from: 'Zone',
            dataLabels: [],
          },
        ],
      },
    },
    information: convertPRJZObjectToFields(jsonPV.PV),
    platform: convertPRJZObjectToFields(jsonPV.Plateform),
    screenshots: [],
  }
}
