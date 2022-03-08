import store from '/src/store'

export const convertJSONFromPRJZToMPVZ = (json: any) => {
  // Update prjz here

  const machine =
    json.Database.Software === 'Fwddyn'
      ? 'heavydyn'
      : json.Machines.Serial.split('-')[0] === 'MAX'
      ? 'maxidyn'
      : 'minidyn'

  const units = convertUnits(json, machine)

  const project: JSONProject = {
    name: json.Dossiers.Name,
    machine,
    settings: {
      arePointsLinked: true,
      arePointsLocked: true,
      arePointsVisible: true,
      areImagesVisible: true,
      pointsState: 'number',
      map: {
        styleIndex: 0,
      },
    },
    units,
    images: [],
    informations: [],
    reports: [],
  }

  project.informations = [
    'Client',
    'Contact',
    'Project',
    'Town',
    'Date',
    'Site',
    'Comments',
  ].map((label: string) => {
    return {
      label,
      value: json.Dossiers[label],
    }
  })

  project.reports = json.PVs.map((jsonPVs: any) => {
    const report: JSONReport = {
      name: jsonPVs.PVs.Name,
      settings: {
        iconName: 'circle',
        isVisible: true,
        selectedColorization: 'Threshold',
        threshold: {
          colors: {
            low: 'green',
            middle: 'yellow',
            high: 'red',
          },
          custom: {},
        },
      },
      points: [] as JSONPoint[],
      valuesNames: {
        groups: {
          selected: 0,
          list: [
            {
              from: 'Drop',
              choices: {
                selected: 0,
              },
              indexes: {
                selected: 0,
                list: (() => {
                  switch (machine) {
                    case 'heavydyn':
                      return json.Sequences.Steps.map(
                        (step: any): HeavydynDropIndex => {
                          return {
                            machine,
                            type: step.TypeDrop as 'Distance' | 'Force',
                            displayedIndex: step.Name,
                          }
                        }
                      )
                    default:
                      return Array(json.ParamsPoint.NbTotal)
                        .fill(0)
                        .map(
                          (_, index): MaxidynDropIndex | MinidynDropIndex => {
                            return {
                              machine,
                              type:
                                index + 1 <= json.ParamsPoint.NbTraining
                                  ? 'Training'
                                  : 'Averaging',
                              displayedIndex: index + 1,
                            }
                          }
                        )
                  }
                })(),
              },
            },
            {
              from: 'Test',
              choices: {
                selected: 0,
              },
            },
            {
              from: 'Zone',
              choices: {
                selected: 0,
              },
            },
          ],
        },
        table: {
          selected: 0,
          list: [
            {
              from: 'Drop',
              valuesNames: [],
            },
            {
              from: 'Test',
              valuesNames: [],
            },
            {
              from: 'Zone',
              valuesNames: [],
            },
          ],
        },
      },
      zones: [],
      informations: [],
      platform: [],
      screenshots: [],
    }

    console.log('json report', report)

    report.informations = [
      'Date',
      'Operator',
      'Lane',
      'Sens',
      'Part',
      'Climat',
      'Comment',
    ].map((label: string) => {
      return {
        label,
        value: jsonPVs.PVs[label],
      }
    })

    report.platform = ['Type', 'Layer', 'Material', 'State', 'GTR'].map(
      (label: string) => {
        return {
          label,
          value: jsonPVs.Plateformes[label],
        }
      }
    )

    report.points = jsonPVs.Points.map((point: any) => {
      const jsonPoint: JSONPoint = {
        coordinates: {
          lng: point.Points.Longitude,
          lat: point.Points.Latitude,
        },
        settings: {
          isVisible: true,
        },
        informations: [],
        drops: [],
      }

      return jsonPoint
    })

    return report
  })

  return project
}

const convertUnits = (json: any, machine: MachineName): JSONUnits => {
  switch (machine) {
    case 'heavydyn':
      return {
        deformation: (() => {
          switch (json.Dossiers.UnitDeplName as string) {
            case '1/100mm':
              return '1/100 mm'
            case 'mm':
              return 'mm'
            case 'um':
              return 'um'
            default:
              return '1/100 mm'
          }
        })(),
        force: (() => {
          switch (json.Dossiers.UnitLoadName as string) {
            case 'N':
              return 'N'
            case 'kN':
              return 'kN'
            default:
              return 'kN'
          }
        })(),
        temperature: 'degC',
      } as JSONHeavydynUnits

    case 'maxidyn':
    case 'minidyn':
      return {
        modulus: (() => {
          switch (json.TypesResultBearing.ResultUnitStr as string) {
            case 'MPa':
              return 'MPa'
            case 'kN':
              return 'kN'
            default:
              return 'MPa'
          }
        })(),
        deformation: 'um',
        force: 'kN',
      } as JSONMaxidynUnits | JSONMinidynUnits
  }
}
