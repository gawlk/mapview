import dedent from 'dedent'
import mapboxgl from 'mapbox-gl'

import {
  currentCategory,
  findFieldInArray,
  replaceAllLFToCRLF,
} from '/src/scripts'

import { dayjsUtc } from '/src/utils/date/dayjs'

export const heavydynPDXExporter: HeavydynExporter = {
  name: '.pdx',
  export: async (project: HeavydynProject) => {
    return new File(
      [
        replaceAllLFToCRLF(dedent`
            ${writeHeader(project)}
      
            ${writeDeviceInformation(project)}
      
            ${writeDeviceConfiguration(project)}
      
            ${writeDeviceCalibration(project)}
      
            ${writePoints(project)}
          `),
      ],
      `${project.reports.selected?.name.toString()}.pdx`,
      { type: 'text/plain' }
    )
  },
}

const writeHeader = (project: HeavydynProject): string => {
  if (!project.reports.selected) {
    throw new Error('cannot find selected report ')
  }

  const reportDate = dayjsUtc(
    findFieldInArray(project.reports.selected.information, 'Date')?.toString()
  ).format('DD-MMM-YYYY')

  const infos = ['Operator', 'Climat'].map((label) =>
    findFieldInArray(project.reports.selected!.information, label)?.toString()
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

const writeDeviceInformation = (project: HeavydynProject): string => {
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

const writeDeviceConfiguration = (project: HeavydynProject): string => {
  const deflectionSensorXAxis = project.calibrations.channels
    .map((channel, index) => {
      let returnString = Math.round(Number(channel.position) * 1000).toString()
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

const writeDeviceCalibration = (project: HeavydynProject) => {
  const calibrationDate = dayjsUtc(project.calibrations.date).format(
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

  const projectProject = project.information.find(
    (info) => info.label === 'Project'
  )?.value

  const siteProject = project.information.find(
    (info) => info.label === 'Site'
  )?.value

  const reportLane = project.reports.selected?.information.find(
    (info) => info.label === 'Lane'
  )?.value

  const materialPlatform = project.reports.selected?.platform
    .find((info) => info.label === 'Material')
    ?.toString()

  const sensorReferenceCalibrationFactor =
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

const writePoints = (project: HeavydynProject) => {
  return project.reports.selected?.line.sortedPoints
    .filter((point) => point.settings.isVisible)
    .map((point) => {
      const temps = point.data
        .slice(0, 3)
        .map((data) => {
          return data.value.getLocaleString({ precision: 1, locale: 'en-US' })
        })
        .join(',')

      const comment = point.data
        .find((data) => data.label.name === 'Comment')
        ?.getRawValue()

      const { lat, lng } = point.toBaseJSON().coordinates as mapboxgl.LngLat

      return dedent`
        [Test Location ${point.index}]
        TestLocation = ${point.data
          .find((data) => data.label.name === 'Chainage')
          ?.getRawValue()},0,0 
        GPSLocation = ${lat.toFixed(8)},${lng.toFixed(8)},0
        TestLane = ${comment}  
        TestType = 0
        DropHistoryType = load and deflections
        TestTemperatures = ${temps} 
        TestTime = ${dayjsUtc(point.date).format('HH:mm:ss')} 
        TestComment = ${comment} 
        NumberOfDrops = ${point.drops.length} 
        ${writeDrops(point, project.calibrations.dPlate)}
        \n
    `
    })
    .join('')
}

const writeDrops = (point: BasePoint, dPlate: number) => {
  const deflection = point.zone.report.project.units.deflection

  return point.drops
    .map((drop, index) => {
      const values = drop.data
        .filter((data) => {
          data.label.unit === deflection &&
            data.label.category === currentCategory
        })
        .map((data) => {
          const value = data.value.getValueAs('um')
          return (value <= 0 ? 0.1 : value).toFixed(2)
        })

      const power =
        ((drop.data[1].getRawValue() * 1e-3) / Math.PI / dPlate / dPlate) * 4

      values.unshift(power.toFixed(2).toString())

      return dedent`
        DropData_${index} = ${values} 
      `
    })
    .join('\n')
}
