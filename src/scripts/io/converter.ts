import { icons } from '/src/scripts'

export const convertJSONFromPRJZToMPVZ = (json: any): JSONMachineProject => {
  // TODO:
  // Versioning: Update prjz here

  const machine =
    json.Database.Software === 'Fwddyn'
      ? 'Heavydyn'
      : json.Hardware.Serial.split('-')[0] === 'MAX'
      ? 'Maxidyn'
      : 'Minidyn'

  const units = convertUnits(json, machine)

  const jsonDropChoices: JSONChoice[] = (() => {
    switch (machine) {
      case 'Heavydyn':
        return [
          ...json.ExportedData.Drops.map((exportedUnit: any) =>
            convertExportedUnitToJSONChoice(exportedUnit)
          ).filter(
            (choice: JSONHeavydynChoice) => choice.name !== 'Deflections'
          ),
          ...json.Calibrations.SensorsPosition.map(
            (position: number): JSONMaxidynChoice => {
              return {
                name: convertSensorPositionToName(position),
                unit: 'deflection',
              }
            }
          ),
        ]
      default:
        return json.ExportedData.Drops.map((exportedUnit: any) =>
          convertExportedUnitToJSONChoice(exportedUnit)
        )
    }
  })()

  const jsonDropIndexes: JSONMachineDropIndex[] =
    ((): JSONMachineDropIndex[] => {
      switch (machine) {
        case 'Heavydyn':
          return json.Sequences.Steps.map(
            (step: any): JSONHeavydynDropIndex => {
              return {
                machine,
                type: step.TypeDrop as HeavydynDropType,
                displayedIndex: step.NumStep,
                value: step.ValueDrop,
                unit: step.TypeDrop,
              }
            }
          )
        default:
          return Array(json.ParamsPoint.NbTotal)
            .fill(0)
            .map((_, index): MaxidynDropIndex | MinidynDropIndex => {
              return {
                machine,
                type:
                  index + 1 <= json.ParamsPoint.NbTraining
                    ? 'Training'
                    : 'Averaging',
                displayedIndex: index + 1,
              }
            })
      }
    })()

  const jsonTestChoices: JSONChoice[] = json.ExportedData.Points.map(
    (exportedUnit: any) => convertExportedUnitToJSONChoice(exportedUnit)
  )

  const project = {
    name: json.Project.Name,
    machine,
    settings: {
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
        styleIndex: 0,
      },
    },
    units,
    images: [],
    informations: [...objectToJSONFields(json.Project)],
    hardware: objectToJSONFields(json.Hardware, {
      readOnly: true,
    }),
    reports: [],
    ...(() => {
      switch (machine) {
        case 'Heavydyn':
          return {
            calibrations: {
              date: json.Calibrations.Date,
              dPlate: json.Calibrations.Dplate,
              channels:
                json.Calibrations.Channels.map((channel: any): JSONChannel => {
                  return {
                    name: channel.Name,
                    position: channel.Position,
                    gain: channel.Gain,
                    acquisition: channel.ChannelAcqu,
                    type: channel.Type,
                  }
                }) || [],
              sensors:
                json.Calibrations.Sensors.map((sensor: any): JSONSensor => {
                  return {
                    name: sensor.Name,
                    gain: sensor.Gain,
                    type: sensor.Type,
                  }
                }) || [],
            },
          }
        default:
          return {
            bearingParameters: {
              min: json.ParamsBearing.MinBearing,
              max: json.ParamsBearing.MaxBearing,
            },
          }
      }
    })(),
  } as JSONMachineProject

  if (json.Sequences) {
    project.informations.push({
      label: 'Sequence',
      value: json.Sequences.Name,
      settings: {},
    })
  }

  project.reports = json.PVs.map((jsonPV: any, index: number) => {
    const iconsNames = Object.keys(icons) as IconName[]

    const report: JSONReport = {
      name: jsonPV.PV.Name,
      settings: {
        iconName: iconsNames[index % iconsNames.length],
        isVisible: true,
        colorization: 'Threshold',
        groupBy: 'Number',
      },
      thresholds: {
        groups: ((): MachineMathUnitsSkeleton<number> => {
          switch (machine) {
            case 'Heavydyn':
              return {
                deflection: 0,
                force: 0,
                temperature: 0,
                distance: 0,
                time: 0,
              } as HeavydynMathUnitsSkeleton<number>
            case 'Maxidyn':
              return {
                modulus: 0,
                deflection: 0,
                force: 0,
                distance: 0,
                time: 0,
              } as MachineMathUnitsSkeleton<number>
            case 'Minidyn':
              return {
                modulus: 0,
                deflection: 0,
                force: 0,
                temperature: 0,
                time: 0,
              } as MinidynMathUnitsSkeleton<number>
          }
        })(),
        colors: (() => {
          return {
            low: machine === 'Heavydyn' ? 'green' : 'red',
            middle: 'yellow',
            high: machine === 'Heavydyn' ? 'red' : 'green',
          }
        })(),
        inputs: {
          isRequiredARange: false,
          isOptionalARange: false,
        },
      },
      zones: [
        {
          name: 'Zone 1',
          settings: {
            color: 'gray',
            isVisible: true,
          },
          points: [] as JSONPoint[],
        },
      ],
      dataLabels: {
        groups: {
          selected: ((): number => {
            switch (machine) {
              case 'Heavydyn':
                return 0
              case 'Maxidyn':
              case 'Minidyn':
                return 1
            }
          })(),
          list: [
            {
              from: 'Drop',
              choices: {
                selected: ((): number => {
                  switch (machine) {
                    case 'Heavydyn':
                      return (
                        jsonDropChoices.findIndex(
                          (choice) => choice.name === 'D0'
                        ) || 0
                      )
                    case 'Maxidyn':
                    case 'Minidyn':
                      return 0
                  }
                })(),
                list: jsonDropChoices,
              },
              indexes: {
                selected: jsonDropIndexes.length - 1,
                list: jsonDropIndexes.map((index) => {
                  return {
                    ...index,
                  }
                }),
              },
            },
            {
              from: 'Test',
              choices: {
                selected: ((): number => {
                  switch (machine) {
                    case 'Heavydyn':
                      return 0
                    case 'Maxidyn':
                    case 'Minidyn':
                      return (
                        jsonTestChoices.findIndex(
                          (choice) => choice.name === 'BearingCapacity'
                        ) || 0
                      )
                  }
                })(),
                list: jsonTestChoices,
              },
            },
            {
              from: 'Zone',
              choices: {
                selected: 0,
                list: [],
              },
            },
          ],
        },
        table: {
          selected: ((): number => {
            switch (machine) {
              case 'Heavydyn':
                return 0
              case 'Maxidyn':
              case 'Minidyn':
                return 1
            }
          })(),
          list: [
            {
              from: 'Drop',
              index: jsonDropIndexes.length - 1,
              dataLabels: ((): string[] => {
                switch (machine) {
                  case 'Heavydyn':
                    return [
                      'Load',
                      ...(() => {
                        const indexD0 = jsonDropChoices.findIndex(
                          (choice) => choice.name === 'D0'
                        )

                        return jsonDropChoices
                          .map((choice) => choice.name)
                          .slice(indexD0, indexD0 + 3)
                      })(),
                    ]
                  case 'Maxidyn':
                  case 'Minidyn':
                    return jsonTestChoices
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
              from: 'Test',
              dataLabels: ((): string[] => {
                switch (machine) {
                  case 'Heavydyn':
                    return jsonTestChoices.map((choice) => choice.name)
                  case 'Maxidyn':
                  case 'Minidyn':
                    return jsonTestChoices
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
              from: 'Zone',
              dataLabels: [],
            },
          ],
        },
      },
      informations: objectToJSONFields(jsonPV.PV),
      platform: objectToJSONFields(jsonPV.Plateform),
      screenshots: [],
    }

    console.log('json pv', jsonPV)
    console.log('json report', report)

    report.zones[0].points = jsonPV.Points.map((point: any, index: number) => {
      const jsonPoint: JSONPoint = {
        number: point.Point.Number,
        index,
        date: point.Point.Date,
        coordinates: {
          lng: point.Point.Longitude,
          lat: point.Point.Latitude,
        },
        settings: {
          isVisible: true,
        },
        informations: [
          {
            label: 'Comment',
            value: point.Point.Comment || '',
            settings: {
              readOnly: true,
            },
          },
        ],
        data: json.ExportedData.Points.map(
          (exportedData: any): JSONDataValue => {
            return {
              label: exportedData.Name,
              value: point.Point[exportedData.Name],
            }
          }
        ),
        drops: point.Drops.map((drop: any, index: number): JSONDrop => {
          const exportedDeflections = (json.ExportedData.Drops as any[]).find(
            (exportedData) => exportedData.Name === 'Deflections'
          )

          return {
            index,
            data: [
              ...(json.ExportedData.Drops as any[])
                .filter((exportedData) => exportedData !== exportedDeflections)
                .map((exportedData: any): JSONDataValue => {
                  return {
                    label: exportedData.Name,
                    value: drop[exportedData.Name],
                  }
                }),
              ...(exportedDeflections
                ? drop.Deflections.map((value: number, index: number) => {
                    return {
                      label: convertSensorPositionToName(
                        json.Calibrations.SensorsPosition[index]
                      ),
                      value,
                    }
                  })
                : []),
            ],
          }
        }),
      }

      return jsonPoint
    })

    return report
  })

  return project
}

const objectToJSONFields = (
  object: any,
  settings: FieldSettings = {}
): JSONField[] =>
  Object.entries(object)
    .filter(
      ([key]) => key !== 'Version' && key !== 'Name' && key !== 'TypeBoard'
    )
    .map(([key, value]) => {
      return {
        label: (() => {
          switch (key) {
            case 'Serial':
              return 'Serial number'
            case 'MAC':
              return 'MAC address'
            case 'LicStart':
              return 'License start'
            case 'LicEnd':
              return 'License end'
            case 'CertStart':
              return 'Certificate start'
            case 'CertEnd':
              return 'Certificate end'
            default:
              return key
          }
        })(),
        value: value as string | number,
        settings,
      }
    })

const convertUnits = (json: any, machine: MachineName): JSONMachineUnits => {
  switch (machine) {
    case 'Heavydyn':
      return {
        deflection: ((): PossibleHeavydynDeflectionUnits => {
          switch (
            (json.ExportedData.Drops as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Deflection'
            )?.Unit
          ) {
            case 'mm':
              return 'mm'
            case 'um':
              return 'um'
            default:
              return '1/100 mm'
          }
        })(),
        force: ((): PossibleHeavydynForceUnits => {
          switch (
            (json.ExportedData.Drops as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Load'
            )?.Unit
          ) {
            case 'N':
              return 'N'
            default:
              return 'kN'
          }
        })(),
        distance: ((): PossibleHeavydynDistanceUnits => {
          switch (
            (json.ExportedData.Points as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Distance'
            )?.Unit
          ) {
            case 'km':
              return 'km'
            case 'mi':
              return 'mi'
            default:
              return 'm'
          }
        })(),
        time: ((): PossibleHeavydynTimeUnits => {
          switch (
            (json.ExportedData.Drops as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Time'
            )?.Unit
          ) {
            case 's':
              return 's'
            case 'us':
              return 'us'
            default:
              return 'ms'
          }
        })(),
        temperature: ((): PossibleHeavydynTemperatureUnits => {
          switch (
            (json.ExportedData.Points as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Temperature'
            )?.Unit
          ) {
            case 'K':
              return 'K'
            case 'degF':
            case '°F':
              return '°F'
            default:
              return '°C'
          }
        })(),
      } as JSONHeavydynUnits

    case 'Maxidyn':
    case 'Minidyn':
      return {
        modulus: (():
          | PossibleMaxidynModulusUnits
          | PossibleMinidynModulusUnits => {
          switch (
            (json.ExportedData.Points as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Modulus'
            )?.Unit
          ) {
            default:
              return 'MPa'
          }
        })(),
        stiffness: (():
          | PossibleMaxidynStiffnessUnits
          | PossibleMinidynStiffnessUnits => {
          switch (
            (json.ExportedData.Points as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Stiffness'
            )?.Unit
          ) {
            default:
              return 'MN / m'
          }
        })(),
        deflection: (():
          | PossibleMaxidynDeflectionUnits
          | PossibleMinidynDeflectionUnits => {
          switch (
            (json.ExportedData.Drops as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Deflection'
            )?.Unit
          ) {
            case 'mm':
              return 'mm'
            default:
              return 'um'
          }
        })(),
        force: ((): PossibleMaxidynForceUnits | PossibleMinidynForceUnits => {
          switch (
            (json.ExportedData.Drops as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Load'
            )?.Unit
          ) {
            case 'N':
              return 'N'
            default:
              return 'kN'
          }
        })(),
        distance: ((): PossibleMaxidynDistanceUnits => {
          switch (
            (json.ExportedData.Points as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Distance'
            )?.Unit
          ) {
            case 'mi':
              return 'mi'
            case 'km':
              return 'km'
            default:
              return 'm'
          }
        })(),
        temperature: ((): PossibleMinidynTemperatureUnits => {
          switch (
            (json.ExportedData.Points as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Temperature'
            )?.Unit
          ) {
            case 'K':
              return 'K'
            case 'degF':
            case '°F':
              return '°F'
            default:
              return '°C'
          }
        })(),
        time: ((): PossibleMaxidynTimeUnits | PossibleMinidynTimeUnits => {
          switch (
            (json.ExportedData.Drops as any[]).find(
              (exportedUnit) => exportedUnit.Type === 'Time'
            )?.Unit
          ) {
            case 's':
              return 's'
            case 'us':
              return 'us'
            default:
              return 'ms'
          }
        })(),
        percentage: '%',
      } as JSONMaxidynUnits | JSONMinidynUnits
  }
}

const convertExportedUnitToJSONChoice = (
  exportedUnit: any
): JSONHeavydynChoice | JSONMaxidynChoice | JSONMinidynChoice => {
  const mathUnitName = (exportedUnit.Type as string).toLowerCase()

  return {
    name: exportedUnit.Name,
    unit:
      exportedUnit.Unit === '%'
        ? 'percentage'
        : mathUnitName === 'number'
        ? exportedUnit.Unit
        : mathUnitName,
  }
}

const convertSensorPositionToName = (position: number) =>
  `D${(position * 1000).toFixed(0)}`