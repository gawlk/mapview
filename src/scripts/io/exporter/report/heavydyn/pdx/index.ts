import dedent from 'dedent'

import {
  currentCategory,
  dayjsUtc,
  findFieldInArray,
  replaceAllLFToCRLF,
} from '/src/scripts'

export const heavydynPDXExporter: HeavydynExporter = {
  name: '.pdx',
  export: (project: HeavydynProject) => {
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
      `${project.reports.selected()?.name.toString() || ''}.pdx`,
      { type: 'text/plain' },
    )
  },
}

const writeHeader = (project: HeavydynProject): string => {
  const selectedReport = project.reports.selected()

  if (!selectedReport) {
    throw new Error('cannot find selected report ')
  }

  const reportDate = dayjsUtc(
    findFieldInArray(selectedReport?.information || [], 'Date')?.toString(),
  ).format('DD-MMM-YYYY')

  const infos = ['Operator', 'Climat'].map(
    (label) => findFieldInArray(selectedReport.information, label)?.toString(),
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
    FileName = ${project.name.toString()}
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
    DeviceSerialNumber = ${project.hardware
      .find((data) => data.label === 'Serial number')
      ?.value?.()
      .toString()}
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
  const { information } = project
  const calibrationDate = dayjsUtc(project.calibrations.date).format(
    'DD-MMM-YYYY',
  )

  let sensorStaticCalibrationFactor = ''
  for (let i = 1; i < project.calibrations.channels.length; i++) {
    sensorStaticCalibrationFactor += Math.round(
      Number(project.calibrations.channels[i].gain) * 1000,
    ).toString()
    if (i !== project.calibrations.channels.length - 1)
      sensorStaticCalibrationFactor += ', '
  }

  const dmiSensor = project.calibrations.sensors.find(
    (sensor) => sensor.name === 'DMI',
  )?.gain

  const projectProject = findFieldInArray(information, 'Project')?.toString()

  const siteProject = findFieldInArray(information, 'Site')?.toString()

  const reportLane = findFieldInArray(
    project.reports.selected()?.information || [],
    'Lane',
  )?.toString()

  const materialPlatform = project.reports
    .selected()
    ?.platform.find((info) => info.label === 'Material')
    ?.toString()

  const sensorReferenceCalibrationFactor =
    '1, '.repeat(project.calibrations.channels.length - 2) + '1'

  return dedent`
      [Device Calibration]
      LoadCellCalibrationDate = ${calibrationDate}
      LoadCellCalibrationFactor = ${Math.round(
        project.calibrations.channels[0].gain * 1000,
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
  if (!project.reports.selected) return ''

  return project.reports
    .selected()
    ?.exportablePoints()
    .map((point) => {
      const temps = Array.from(point.dataset.values())
        .slice(0, 3)
        .map((data) => {
          return data.value.getLocaleString({ precision: 1, locale: 'en-US' })
        })
        .join(',')

      const comment = Array.from(point.dataset.values())
        .find((data) => data.label.name === 'Comment')
        ?.rawValue()

      const { lat, lng } = point.toBaseJSON().coordinates as LngLat

      return dedent`
        [Test Location ${point.index()}]
        TestLocation = ${Array.from(point.dataset.values())
          .find((data) => data.label.name === 'Chainage')
          ?.rawValue()},0,0
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
  const deflection = point.zone().report().project().units.deflection

  return point.drops
    .map((drop, index) => {
      const values = Array.from(drop.dataset.values())
        .filter(
          (data) =>
            data.label.unit === deflection &&
            data.label.category.name === currentCategory.name,
        )
        .map((data) => {
          const value = data.value.getValueAs('um')
          return (value <= 0 ? 0.1 : value).toFixed(2)
        })

      const power =
        ((Array.from(drop.dataset.values())[1].rawValue() * 1e-3) /
          Math.PI /
          dPlate /
          dPlate) *
        4

      values.unshift(power.toFixed(2).toString())

      return dedent`
        DropData_${index} = ${values}
      `
    })
    .join('\n')
}
