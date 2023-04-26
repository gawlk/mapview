import { getBrowserLocale, translate } from '/src/locales'

import {
  convertUint8arrayToXML,
  convertValueFromUnitAToUnitB,
  createMathNumber,
  createZipFromEntity,
  unzipFile,
} from '/src/scripts'

export const mrvzExporter = {
  name: '.mvrz (Excel)',
  export: async (project: MachineProject, template?: File) => {
    let needsRawData = true

    if (template) {
      const UnzippedTemplate = await unzipFile(template)

      const xml = convertUint8arrayToXML(
        UnzippedTemplate['xl/worksheets/sheet1.xml']
      )

      const rows = Array.from(
        xml.getElementsByTagName('sheetData')[0].getElementsByTagName('row')
      )

      const currentRow = rows.find((row) => row.getAttribute('r') === '3')

      const cell = Array.from(currentRow?.getElementsByTagName('c') || []).find(
        (_cell) => _cell.getAttribute('r') === 'B3'
      )

      needsRawData = cell?.firstChild?.firstChild?.nodeValue !== '0' // not sending raw data only if the value we get is false
    }

    return new File(
      project.reports.selected
        ? [
            await createZipFromEntity(project.reports.selected, {
              rawData: needsRawData,
              screenshots: true,
              customJSON: {
                name: 'database.json',
                json: createMVRZJson(project),
              },
              template: template,
            }),
          ]
        : [],
      `${project.name.toString()}_${
        project.reports.selected?.name.toString() || ''
      }.mvrz`,
      { type: 'blob' }
    )
  },
}

const generateInformationFromFields = (
  fields: Field[],
  tag: string
): ExcelJson =>
  fields.reduce<ExcelJson>((a, v) => {
    const label = tag + toPascalCase(v.label)
    const value = v.getValue()

    return {
      ...a,
      [label]: value,
    }
  }, {})

// Replace to sanitize excel
const toPascalCase = (str: string): string =>
  str
    .replace(/-/g, 'M')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\(|\)/g, '')
    .replace(/\s+/g, '')

const generatePointData = (
  points: BasePoint[],
  labelPrefix: string
): ExcelJson =>
  points.reduce<FlatDataJson>(
    (a, point) =>
      point.data.reduce<FlatDataJson>((b, data) => {
        const label = labelPrefix + toPascalCase(data.label.getSerializedName())

        const values = [...((b[label] || []) as number[]), data.toExcel()]

        return {
          ...b,
          [label]: values,
        }
      }, a),
    {}
  )

const generatePointInformation = (points: BasePoint[], labelPrefix: string) =>
  points.reduce<FlatDataJson>(
    (a, point) => ({
      ...point.information.reduce<FlatDataJson>((b, information) => {
        const label = labelPrefix + toPascalCase(information.label)
        const value = information.getValue()
        const values = [...(b[label] || []), value]

        return {
          ...b,
          [label]: values as number[] | string[] | boolean[],
        }
      }, a),
      [labelPrefix + 'ID']: [
        ...((a[labelPrefix + 'ID'] || []) as string[]),
        point.id,
      ],
      [labelPrefix + 'Number']: [
        ...((a[labelPrefix + 'Number'] || []) as number[]),
        point.number,
      ],
      [labelPrefix + 'Date']: [
        ...((a[labelPrefix + 'Date'] || []) as string[]),
        point.date.toISOString(),
      ],
      [labelPrefix + 'Longitude']: [
        ...((a[labelPrefix + 'Longitude'] || []) as number[]),
        point.marker?.getLngLat().lng || 0,
      ],
      [labelPrefix + 'Latitude']: [
        ...((a[labelPrefix + 'Latitude'] || []) as number[]),
        point.marker?.getLngLat().lat || 0,
      ],
    }),
    {}
  )

const generateDropData = (
  points: BasePoint[],
  labelPrefix: string
): ExcelJson =>
  points.reduce<FlatDataJson>((a, point) => {
    const drops: MachineDrop[] = point.drops

    return drops.reduce<FlatDataJson>(
      (b, drop) => ({
        ...b,
        [`${labelPrefix}${drop.index.displayedIndex}_Number`]: new Array(
          points.length
        ).fill(drop.index.displayedIndex),
        ...drop.data.reduce<FlatDataJson>((c, data) => {
          const label = `${labelPrefix}${
            drop.index.displayedIndex
          }_${toPascalCase(data.label.getSerializedName())}`

          const values = (c[label] || []) as (number | null)[]

          values.push(data.toExcel())

          return {
            ...c,
            [label]: values,
          }
        }, b),
      }),
      a
    )
  }, {})

const generateZoneData = (zones: MachineZone[]): ExcelJson =>
  zones.reduce<ExcelJson>((a, zone, index) => {
    const { points } = zone as BaseZone

    const visiblePoints = points.filter((point) => point.settings.isVisible)

    const Z = `Z${index + 1}`

    return {
      ...a,
      [`${Z}_Name`]: zone.name,
      ...zone.data.reduce<ExcelJson>(
        (prev, data) => ({
          ...prev,
          [`${Z}_${toPascalCase(data.label.name)}`]: data.toExcel(),
        }),
        {}
      ),
      ...generatePointInformation(visiblePoints, `${Z}_Pi_`),
      ...generatePointData(visiblePoints, `${Z}_Pi_`),
      ...generateDropData(visiblePoints, `${Z}_Pi_D`),
    }
  }, {})

const generateUnits = (units: MachineMathUnits): ExcelJson =>
  Object.values(units).reduce<ExcelJson>(
    (a, unit: MathUnit<string>) => ({
      ...a,
      [`Unit_${unit.name}_Name`]: translate(unit.name),
      [`Unit_${unit.name}_Unit`]: unit.currentUnit,
      [`Unit_${unit.name}_Max`]: convertValueFromUnitAToUnitB(
        unit.max,
        unit.baseUnit,
        unit.currentUnit
      ),
      [`Unit_${unit.name}_Min`]: convertValueFromUnitAToUnitB(
        unit.min,
        unit.baseUnit,
        unit.currentUnit
      ),
    }),
    {}
  )

const generateThresholds = (thresholds: MachineThresholds): ExcelJson =>
  Object.values(thresholds.groups).reduce<ExcelJson>(
    (a, group: ThresholdsGroup<string>) => {
      if (group.choices.selected) {
        return {
          ...a,
          [`Thresholds_${group.unit.name}_Kind`]: group.choices.selected.kind,
          [`Thresholds_${group.unit.name}_Name`]: group.choices.selected.name,
          [`Thresholds_${group.unit.name}_Value`]: createMathNumber(
            group.choices.selected.value,
            group.unit
          ).getValueAs(group.unit.currentUnit),
          ...(group.choices.selected.kind === 'custom' &&
          group.choices.selected.type !== 'Bicolor'
            ? {
                [`Thresholds_${group.unit.name}_ValueHigh`]: createMathNumber(
                  group.choices.selected.valueHigh,
                  group.unit
                ).getValueAs(group.unit.currentUnit),
              }
            : {}),
        }
      }
      return a
    },
    {}
  )

const generateAcquisitionParameters = (project: MachineProject) => ({
  AcquisitionParameters_NbSamples: project.acquisitionParameters.nbSamples,
  AcquisitionParameters_Frequency: project.acquisitionParameters.frequency,
  AcquisitionParameters_Pretrig: project.acquisitionParameters.preTrig,
  ...(project.acquisitionParameters.smoothing
    ? {
        AcquisitionParameters_Smoothing:
          project.acquisitionParameters.smoothing,
      }
    : {}),
})

const generateSequence = (report: MachineReport): ExcelJson => {
  if (report.machine === 'Heavydyn') {
    const dropDataLabels = report.dataLabels.groups.list[0]

    const dropSequence: ExcelJson = {
      DropSequence_Name: dropDataLabels.sequenceName,
      DropSequence_Total: dropDataLabels.indexes.list.length || 0,
    }

    dropDataLabels.indexes.list.forEach((dropIndex, index) => {
      dropSequence[`DropSequence_Drop${index + 1}_Type`] = translate(
        dropIndex.type
      )

      dropSequence[`DropSequence_Drop${index + 1}_Value`] = dropIndex.value.unit
        ? dropIndex.value.getValueAs(dropIndex.value.unit?.currentUnit)
        : dropIndex.value.value
    })

    return dropSequence
  }

  const indexesList = report.dataLabels.groups.list[0].indexes.list as (
    | MaxidynDropIndex
    | MinidynDropIndex
  )[]

  return {
    DropSequence_Total: indexesList.length,
    DropSequence_Training: indexesList.filter(
      (index) => index.type === 'Training'
    ).length,
    DropSequence_Averaging: indexesList.filter(
      (index) => index.type === 'Averaging'
    ).length,
  }
}

const generateCalibrations = (
  calibrations: HeavydynCalibrations
): ExcelJson => ({
  Calibration_Date: calibrations.date.toISOString(),
  Calibration_Dplate: calibrations.dPlate,
  ...calibrations.channels.reduce<ExcelJson>(
    (a, channel, index) => ({
      ...a,
      [`Calibration_Channel${index + 1}_Name`]: channel.name,
      [`Calibration_Channel${index + 1}_Version`]: channel.version,
      [`Calibration_Channel${index + 1}_Position`]: channel.position,
      [`Calibration_Channel${index + 1}_Gain`]: channel.gain,
      [`Calibration_Channel${index + 1}_Acquisition`]: channel.acquisition,
      [`Calibration_Channel${index + 1}_Type`]: channel.type,
      [`Calibration_Channel${index + 1}_V0`]: channel.v0,
    }),
    {}
  ),
  ...calibrations.sensors.reduce<ExcelJson>(
    (a, sensor, index) => ({
      ...a,
      [`Calibration_Sensor${index + 1}_Name`]: sensor.name,
      [`Calibration_Sensor${index + 1}_Version`]: sensor.version,
      [`Calibration_Sensor${index + 1}_Gain`]: sensor.gain,
      [`Calibration_Sensor${index + 1}_Type`]: sensor.type,
      [`Calibration_Sensor${index + 1}_V0`]: sensor.v0,
    }),
    {}
  ),
})

const generateBearingParameters = (
  parameters: JSONBearingParameters
): ExcelJson => ({
  ['BearingParameters_Version']: parameters.version,
  ['BearingParameters_Name']: parameters.name,
  ['BearingParameters_AlgoBearing']: parameters.algoBearing,
  ['BearingParameters_HasQuality']: parameters.hasQuality,
  ['BearingParameters_AlgoProcessing1']: parameters.algoProcessing1,
  ['BearingParameters_AlgoProcessing2']: parameters.algoProcessing2,
  ['BearingParameters_DPlate']: parameters.dPlate,
  ['BearingParameters_CPoisson']: parameters.cPoisson,
  ['BearingParameters_FForme']: parameters.fForme,
  ['BearingParameters_K']: parameters.k,
  ['BearingParameters_Alpha']: parameters.alpha,
})

const generateHeavydynData = (project: HeavydynProject): ExcelJson => {
  const {
    correctionParameters: { load, temperature },
  } = project

  return {
    ...generateCalibrations(project.calibrations),
    ...{
      [`CorrectionParameters_Load_Active`]: load.active,
      [`CorrectionParameters_Load_CustomValue`]: load.customValue.unit
        ? load.customValue.getValueAs(load.customValue.unit.currentUnit)
        : load.customValue.value,
      [`CorrectionParameters_Load_LoadReferenceSource`]:
        load.source.selected || '',

      [`CorrectionParameters_Temperature_Active`]: temperature.active,
      [`CorrectionParameters_Temperature_TemperatureFromSource`]:
        temperature.source.selected || '',
      [`CorrectionParameters_Temperature_Average`]:
        temperature.average.selected || '',
      [`CorrectionParameters_Temperature_CustomValue`]:
        temperature.customValue.value,
      [`CorrectionParameters_Temperature_ReferenceTemperature`]:
        temperature.reference.value,
      [`CorrectionParameters_Temperature_StructureType_Name`]:
        temperature.structureType.selected?.name || '',
      [`CorrectionParameters_Temperature_StructureType_K`]:
        temperature.structureType.selected?.k || '',
    },
  }
}

const generateMaxidynData = (project: MaxidynProject): ExcelJson => ({
  ...generateBearingParameters(project.bearingParameters),
})

const generateMinidynData = (project: MinidynProject): ExcelJson => ({
  ...generateBearingParameters(project.bearingParameters),
})

const generateSpecificMachineData = (project: MachineProject): ExcelJson => {
  switch (project.machine) {
    case 'Heavydyn':
      return generateHeavydynData(project)
    case 'Maxidyn':
      return generateMaxidynData(project)
    case 'Minidyn':
      return generateMinidynData(project)

    // No Default
  }
}

const createBaseJson = (project: MachineProject): ExcelJson => {
  if (!project.reports.selected) return {}
  return {
    JsonFileFormat: 'Report database from Mapview',
    Version: 1,
    Database_Software: 'Mapview',
    Database_Local: getBrowserLocale(false) || 'NA',
    Database_TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    Database_Iterators_Name: ['Z', 'P', 'D'],
    Database_Iterators_Optional: [true, false, false],
    Database_Iterators_FixedSize: [true, false, true],
    Database_Iterators_DirectAdressing: [true, false, true],
    Project_Name: project.name.toString(),
    ...generateInformationFromFields(project.information, 'Project_'),
    ...generateInformationFromFields(project.hardware, 'Hardware_'),
    Report_Name: project.reports.selected.name.toString(),
    ...generateInformationFromFields(
      project.reports.selected.information,
      'Report_'
    ),
    ...generateInformationFromFields(
      project.reports.selected.platform,
      'Platform_'
    ),
    ...generateAcquisitionParameters(project),
    ...generateUnits(project.units),
    ...generateThresholds(project.reports.selected.thresholds),
    ...generateSequence(project.reports.selected),
  }
}

const createMVRZJson = (project: MachineProject): ExcelJson => {
  if (!project.reports.selected) return {}

  const { sortedPoints } = project.reports.selected.line

  const visiblePoints = sortedPoints.filter((point) => point.checkVisibility)

  return {
    ...createBaseJson(project),
    ...generatePointInformation(visiblePoints, 'Pi_'),
    ...generatePointData(visiblePoints, 'Pi_'),
    ...generateDropData(visiblePoints, 'Pi_D'),
    ...generateZoneData(project.reports.selected.zones),
    ...generateSpecificMachineData(project),
  }
}
