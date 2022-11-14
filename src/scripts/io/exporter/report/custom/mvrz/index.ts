import { getBrowserLocale } from '/src/locales'

import { createZipFromProject, createMathNumber } from '/src/scripts'

export const mrvzExporter: MachineExporter = {
  name: '.mvrz (Excel)',
  export: async (project: MachineProject) =>
    new File(
      [
        await createZipFromProject(project, {
          rawData: true,
          screenshots: true,
          customJSON: {
            name: 'database.json',
            json: createJson(project),
          },
        }),
      ],
      `${project.reports.selected?.name.toString().replaceAll(' ', '_')}.json`,
      { type: 'application/json' }
    ),
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

//Replace to sanitize excel
const toPascalCase = (str: string): string =>
  str
    .replace(/-/g, 'M')
    .replace(/_/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, '')

const generatePointData = (
  points: MachinePoint[],
  labelPrefix: string
): ExcelJson =>
  points.reduce<FlatDataJson>(
    (a, point) =>
      point.data.reduce<FlatDataJson>((b, data) => {
        const label = labelPrefix + toPascalCase(data.label.name)
        const value = data.value.getValueAs(data.label.unit.currentUnit)
        const values = [...((b[label] || []) as number[]), value]

        return {
          ...b,
          [label]: values,
        }
      }, a),
    {}
  )

const generatePointInformations = (
  points: MachinePoint[],
  labelPrefix: string
) =>
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
  points: MachinePoint[],
  labelPrefix: string
): ExcelJson =>
  points.reduce<FlatDataJson>((a, point) => {
    const drops: MachineDrop[] = point.drops
    return drops.reduce<FlatDataJson>((b, drop) => ({
      ...b,
      ...drop.data.reduce<FlatDataJson>((c, data) => {
        const label =
          labelPrefix +
          drop.index.displayedIndex +
          '_' +
          toPascalCase(data.label.name)
        const values = (c[label] || []) as number[]

        values.push(data.value.getValueAs(data.label.unit.currentUnit))
        return {
          ...c,
          [label]: values,
        }
      }, b),
    }), a)
  }, {})

const generateZoneData = (zones: MachineZone[]): ExcelJson =>
  zones.reduce<ExcelJson>((a, zone, index) => ({
    ...a,
    ['Z' + (index + 1) + '_Name']: zone.name,
    ...generatePointInformations(zone.points, 'Z' + (index + 1) + '_Pi_'),
    ...generatePointData(zone.points, 'Z' + (index + 1) + '_Pi_'),
    ...generateDropData(zone.points, 'Z' + (index + 1) + '_Pi_D'),
  }), {})

const generateUnits = (units: MachineMathUnits): ExcelJson =>
  Object.values(units).reduce<ExcelJson>(
    (a, unit: MathUnit<string>) => ({
      ...a,
      ['Unit_' + unit.name]: unit.currentUnit,
    }),
    {}
  )

const generateThresholds = (thresholds: MachineReportThresholds): ExcelJson =>
  Object.values(thresholds.groups).reduce<ExcelJson>(
    (a, group: GroupedThresolds<string>) => {
      if (group.choices.selected) {
        const value = createMathNumber(group.choices.selected.value, group.unit);
        return {
          ...a,
          ['Thresholds_' + group.unit.name + '_Kind']:
            group.choices.selected.kind,
          ['Thresholds_' + group.unit.name + '_Name']:
            group.choices.selected.name,
          ['Thresholds_' + group.unit.name + '_Value']:
            value.getValueAs(group.unit.currentUnit),
        }
      }
      return a
    },
    {}
  )

const generateCalibrations = (calibrations: HeavydynCalibrations): ExcelJson =>
({
  'Calibration_Date': calibrations.date.toISOString(),
  'Calibration_Dplate': calibrations.dPlate,
  ...calibrations.channels.reduce<ExcelJson>((a, channel, index) => ({
    ...a,
    ['Calibration_Channel_' + (index + 1) + '_Name']: channel.name,
    ['Calibration_Channel_' + (index + 1) + '_Version']: channel.version,
    ['Calibration_Channel_' + (index + 1) + '_Position']: channel.position,
    ['Calibration_Channel_' + (index + 1) + '_Gain']: channel.gain,
    ['Calibration_Channel_' + (index + 1) + '_Acquisition']: channel.acquisition,
    ['Calibration_Channel_' + (index + 1) + '_Type']: channel.type,
  }), {}),
  ...calibrations.sensors.reduce<ExcelJson>((a, sensor, index) => ({
    ...a,
    ['Calibration_Sensor_' + (index + 1) + '_Name']: sensor.name,
    ['Calibration_Sensor_' + (index + 1) + '_Version']: sensor.version,
    ['Calibration_Sensor_' + (index + 1) + '_Gain']: sensor.gain,
    ['Calibration_Sensor_' + (index + 1) + '_Type']: sensor.type,
  }), {}),
})

const generateBearingParameters = (parameters: JSONBearingParameters): ExcelJson => ({
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

const generateHeavydynData = (project: HeavydynProject): ExcelJson => ({
  ...generateCalibrations(project.calibrations),
})

const generateMaxidynData = (project: MaxidynProject): ExcelJson => ({
  ...generateBearingParameters(project.bearingParameters),
})

const generateMinidynData = (project: MinidynProject): ExcelJson => ({
  ...generateBearingParameters(project.bearingParameters),
})

const generateSpecificMachineData = (project: MachineProject): ExcelJson => {
  switch (project.machine) {
    case 'Heavydyn':
      return generateHeavydynData(project as HeavydynProject)
    case 'Maxidyn':
      return generateMaxidynData(project as MaxidynProject)
    case 'Minidyn':
      return generateMinidynData(project as MinidynProject)
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
    ...generateInformationFromFields(project.information, 'Project_'),
    ...generateInformationFromFields(project.hardware, 'Hardware_'),
    ...generateInformationFromFields(
      project.reports.selected.information,
      'Report_'
    ),
    ...generateInformationFromFields(
      project.reports.selected.platform,
      'Platform_'
    ),
    ...generateUnits(project.units),
    ...generateThresholds(project.reports.selected.thresholds),
  }
}

const createJson = (project: MachineProject): ExcelJson => {
  if (!project.reports.selected) return {}
  return {
    ...createBaseJson(project),
    ...generatePointInformations(
      project.reports.selected.line.sortedPoints,
      'Pi_'
    ),
    ...generatePointData(project.reports.selected.line.sortedPoints, 'Pi_'),
    ...generateDropData(project.reports.selected.line.sortedPoints, 'Pi_D'),
    ...generateZoneData(project.reports.selected.zones),
    ...generateSpecificMachineData(project),
  }
}
