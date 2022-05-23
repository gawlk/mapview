import dayjs from 'dayjs'
import dedent from 'dedent'

export class PDXExportStrategy implements ExportStrategy {
  doExport(project: MachineProject): string {
    return dedent`
      ${this.writeHeader(project)}

      ${this.writeDeviceInformation(project)}

      ${this.writeDeviceConfiguration(project)}

      ${this.writeDeviceCalibration(project)}
    `
  }

  public writeHeader(project: MachineProject): string {
    const reportDate = dayjs(
      project.reports.selected?.informations.find(
        (info) => info.label === 'Date'
      )?.value.value
    ).format('DD-MMM-YYYY')

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
    OperatorName = ${
      project.reports.selected?.informations.find(
        (info) => info.label === 'Operator'
      )?.value
    } 
    WeatherCondition = ${
      project.reports.selected?.informations.find(
        (info) => info.label === 'Climat'
      )?.value
    }
    `
  }

  public writeDeviceInformation(project: MachineProject): string {
    let sensorSerialNumbers = ``
    for (let i = 1; i < project.channels.length; i++) {
      sensorSerialNumbers += project.channels[i].name
      if (i !== project.channels.length) sensorSerialNumbers += ', '
    }

    return dedent`
    [Device Information]
    DeviceDesignationName = Rincent
    DeviceModelNumber =  HEAVYDYN
    DeviceSerialNumber = ${
      project.hardware.find((data) => data.label === 'Serial number')?.value
    } 
    LoadCellSerialNumber = ${project.channels[0].name}  
    SensorSerialNumber = ${sensorSerialNumbers}
    DeviceLoadType = Impulse
    `
  }

  public writeDeviceConfiguration(project: MachineProject): string {
    const deflectionSensorXAxis = project.channels
      .map((channel, index) => {
        let returnString = Math.round(
          Number(channel.position) * 1000
        ).toString()
        if (index !== project.channels.length) returnString += ', '
        return returnString
      })
      .join('')

    return dedent`
     [Device Configuration]
     LoadPlateRadius = 150 // dplate / 2 (mm)
     NumberOfDeflectionSensors = ${project.channels.length - 1} 
     DeflectionSensorXAxisDistances = ${deflectionSensorXAxis}
     DeflectionSensorYAxisDistances = 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
     NumberOfTemperatureSensors = 3
     TemperatureSensorUse = air,surface,manual
    `
  }

  public writeDeviceCalibration(project: MachineProject) {
    const calibrationDate = dayjs().format('DD-MMM-YYYY')

    let sensorStaticCalibrationFactor = ''
    for (let i = 1; i < project.channels.length; i++) {
      sensorStaticCalibrationFactor += Math.round(
        Number(project.channels[i].gain) * 1000
      ).toString()
      if (i !== project.channels.length - 1)
        sensorStaticCalibrationFactor += ', '
    }

    let sensorReferenceCalibrationFactor =
      '1, '.repeat(project.channels.length - 2) + '1'

    return dedent`
      [Device Calibration]
      LoadCellCalibrationDate = ${calibrationDate} // cali.date
      LoadCellCalibrationFactor = ${Math.round(
        project.channels[0].gain * 1000
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
      DMIDeviceCalibrationFactor = 8812 // cali.sensors type dmi 
    `
  }
}
