import { getBrowserLocale } from '/src/locales'

import { createZipFromProject } from '/src/scripts'

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
): ExcelJson => {
  return fields.reduce<ExcelJson>((a, v) => {
    const label = tag + toPascalCase(v.label)
    const value = v.getValue()

    return {
      ...a,
      [label]: value,
    }
  }, {})
}

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
    return drops.reduce<FlatDataJson>((b, drop) => {
      return {
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
      }
    }, a)
  }, {})

const generateZoneData = (zones: MachineZone[]): ExcelJson =>
  zones.reduce<ExcelJson>((a, zone, index) => {
    return {
      ...a,
      ['Z' + (index + 1) + '_Name']: zone.name,
      ...generatePointInformations(zone.points, 'Z' + (index + 1) + '_Pi_'),
      ...generatePointData(zone.points, 'Z' + (index + 1) + '_Pi_'),
      ...generateDropData(zone.points, 'Z' + (index + 1) + '_Pi_D'),
    }
  }, {})

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
        return {
          ...a,
          ['Thresholds_' + group.unit.name + '_Kind']:
            group.choices.selected.kind,
          ['Thresholds_' + group.unit.name + '_Name']:
            group.choices.selected.name,
          ['Thresholds_' + group.unit.name + '_Value']:
            group.choices.selected.value,
        }
      }
      return a
    },
    {}
  )

const generateHeavydynData = (project: HeavydynProject): ExcelJson => {
  return {}
}

const generateMaxidynData = (project: MaxidynProject): ExcelJson => {
  return {}
}

const generateMinidynData = (project: MinidynProject): ExcelJson => {
  return {}
}

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
