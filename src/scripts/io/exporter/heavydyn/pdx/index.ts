import dayjs from 'dayjs'
import dedent from 'dedent'
import { findFieldInArray } from '/src/scripts/entities'

export class PDXExportStrategy implements ExportStrategy {
  extension: string = 'pdx'

  doExport(project: HeavydynProject): string {
    return dedent`
      ${this.writeHeader(project)}

      ${this.writeDeviceInformation(project)}

      ${this.writeDeviceConfiguration(project)}

      ${this.writeDeviceCalibration(project)}

      ${this.writePoints(project)}
    `
  }

  public writeHeader(project: HeavydynProject): string {
    if (!project.reports.selected) {
      throw new Error('cannot find selected report ')
    }

    const reportDate = dayjs(
      findFieldInArray(
        project.reports.selected.informations,
        'Date'
      )?.convertValueToString()
    ).format('DD-MMM-YYYY')

    const infos = ['Operator', 'Climat'].map((label) =>
      findFieldInArray(
        project.reports.selected!.informations,
        label
      )?.convertValueToString()
    )

    return dedent`
    [Pavement Deflection Data Exchange File]
    PDDXVersionNumber = 1.0
    DelimiterSymbol = ,
    DecimalSymbol = .
    
    [Units]
    LoadPlateRadiusUnits = millimeter
    LoadUnits = kilo-Newton
    DeflectionUnits = micron
    TemperatureUnits = Celsius
    SensorLocationUnits = millimeter
    GPSUnits = degree,degree,meter
    TestLocationUnits = kilometer,meter,meter
    NominalTestSpacingUnits = meter
    LoadFrequencyUnits = Hertz
    DropHistoryDataFrequencyUnits = Hertz

    [Operations Information]
    FileName = ${project.name.value}
    StartDate = ${reportDate} 
    EndDate = ${reportDate} 
    OperatorName = ${infos[0]} 
    WeatherCondition = ${infos[1]}
    `
  }

  public writeDeviceInformation(project: HeavydynProject): string {
    let sensorSerialNumbers = ``
    for (let i = 1; i < project.calibrations.channels.length; i++) {
      sensorSerialNumbers += project.calibrations.channels[i].name
      if (i !== project.calibrations.channels.length - 1)
        sensorSerialNumbers += ', '
    }

    return dedent`
    [Device Information]
    DeviceDesignationName = Rincent
    DeviceModelNumber =  HEAVYDYN
    DeviceSerialNumber = ${
      project.hardware.find((data) => data.label === 'Serial number')?.value
    } 
    LoadCellSerialNumber = ${project.calibrations.channels[0].name}  
    SensorSerialNumber = ${sensorSerialNumbers}
    DeviceLoadType = Impulse
    `
  }

  public writeDeviceConfiguration(project: HeavydynProject): string {
    const deflectionSensorXAxis = project.calibrations.channels
      .map((channel, index) => {
        let returnString = Math.round(
          Number(channel.position) * 1000
        ).toString()
        if (index !== project.calibrations.channels.length - 1)
          returnString += ', '
        return returnString
      })
      .join('')

    return dedent`
     [Device Configuration]
     LoadPlateRadius = ${project.calibrations.dPlate} 
     NumberOfDeflectionSensors = ${project.calibrations.channels.length - 1} 
     DeflectionSensorXAxisDistances = ${deflectionSensorXAxis}
     DeflectionSensorYAxisDistances = 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
     NumberOfTemperatureSensors = 3
     TemperatureSensorUse = air,surface,manual
    `
  }

  public writeDeviceCalibration(project: HeavydynProject) {
    const calibrationDate = dayjs(project.calibrations.date).format(
      'DD-MMM-YYYY'
    )

    let sensorStaticCalibrationFactor = ''
    for (let i = 1; i < project.calibrations.channels.length; i++) {
      sensorStaticCalibrationFactor += Math.round(
        Number(project.calibrations.channels[i].gain) * 1000
      ).toString()
      if (i !== project.calibrations.channels.length - 1)
        sensorStaticCalibrationFactor += ', '
    }

    const dmiSensor = project.calibrations.sensors.find(
      (sensor) => sensor.name === 'DMI'
    )?.gain

    const projectProject = project.informations.find(
      (info) => info.label === 'Project'
    )?.value

    const siteProject = project.informations.find(
      (info) => info.label === 'Site'
    )?.value

    const reportLane = project.reports.selected?.informations.find(
      (info) => info.label === 'Lane'
    )?.value

    const materialPlatform = project.reports.selected?.platform.find(
      (info) => info.label === 'Material'
    )?.value

    let sensorReferenceCalibrationFactor =
      '1, '.repeat(project.calibrations.channels.length - 2) + '1'

    return dedent`
      [Device Calibration]
      LoadCellCalibrationDate = ${calibrationDate}
      LoadCellCalibrationFactor = ${Math.round(
        project.calibrations.channels[0].gain * 1000
      )} 
      LoadCellCalibrationIntercept = 0
      SensorStaticCalibrationDate = ${calibrationDate} 
      SensorStaticCalibrationFactor = ${sensorStaticCalibrationFactor}
      SensorDynamicCalibrationDate = ${calibrationDate} 
      SensorDynamicCalibrationFactor = ${sensorReferenceCalibrationFactor}
      SensorReferenceCalibrationDate = ${calibrationDate} 
      SensorReferenceCalibrationFactor = ${sensorReferenceCalibrationFactor}
      SensorRelativeCalibrationDate = ${calibrationDate} 
      SensorRelativeCalibrationFactor = ${sensorReferenceCalibrationFactor}
      DMIDeviceCalibrationDate = ${calibrationDate} 
      DMIDeviceCalibrationFactor = ${dmiSensor} 

      [Location Identification]
      SiteName = ${projectProject} 
      FacilityName = ${siteProject} 
      SectionName = ${reportLane}
      PavementType = ${materialPlatform}
    `
  }

  public writePoints(project: HeavydynProject) {
    return project.reports.selected?.line.sortedPoints
      .map((point) => {
        const temps = point.data
          .slice(0, 3)
          .map((data) => {
            return data.value.getLocaleString({ precision: 1, locale: 'en-US' })
          })
          .join(',')

        const comment = point.data.find((data) => data.label.name === 'Comment')
          ?.value.value

        let [lat, lng] = [1, 1]
        if (point.marker) {
          ;({ lng, lat } = point.marker.getLngLat())
        }

        return dedent`
        [Test Location ${point.index}]
        TestLocation = ${
          point.data.find((data) => data.label.name === 'Chainage')?.value.value
        },0,0 
        GPSLocation = ${lat.toFixed(8)},${lng.toFixed(8)},0
        TestLane = ${comment}  
        TestType = 0
        DropHistoryType = load and deflections
        TestTemperatures = ${temps} 
        TestTime = ${dayjs(point.date).format('HH:mm:ss')} 
        TestComment = ${comment} 
        NumberOfDrops = ${point.drops.length} 
        ${this.writeDrops(point, project.calibrations.dPlate)}
        \n
    `
      })
      .join('')
  }

  public writeDrops(point: MachinePoint, dPlate: number) {
    return point.drops
      .map((drop, index) => {
        const values = drop.data.slice(2).map((data) => {
          let value: string | number = data.value.getValueAs('um')
          value = value.toFixed(2)
          if (Number(value) <= 0) value = 0.1
          return value.toString()
        })

        const power =
          ((drop.data[1].value.value * 1e-3) / Math.PI / dPlate / dPlate) * 4
        values.unshift(power.toFixed(2).toString())
        return dedent`
        DropData_${index} = ${values} 
      `
      })
      .join('\n')
  }
}