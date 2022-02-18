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
      name: label,
      value: json.Dossiers[label],
    }
  })

  project.reports = json.PVs.map((json: any) => {
    const report: JSONReport = {
      name: json.PVs.Name,
      values: {
        selectedList: 'Drop',
        drop: {
          selected: 0,
        },
        point: {
          selected: 0,
        },
        zone: {
          selected: 0,
        },
      },
      settings: {
        iconName: 'circle',
        isVisible: true,
        selectedColorization: 'Threshold',
      },
      points: [],
      zones: [],
      informations: [],
      platform: [],
      screenshots: [],
    }

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
        name: label,
        value: json.PVs[label],
      }
    })

    report.platform = ['Type', 'Layer', 'Material', 'State', 'GTR'].map(
      (label: string) => {
        return {
          name: label,
          value: json.Plateformes[label],
        }
      }
    )

    report.points = json.Points.map((point: any) => {
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
