import { convertPRJZToBaseReport } from './base'
import {
  convertPRJZToMinidynDropChoices,
  convertPRJZToMinidynDropIndexes,
} from '../drop'
import { convertPRJZToMinidynPoint } from '../point'
import { convertPRJZToTestChoices } from '../shared'

export const convertPRJZToMinidynReport = (
  jsonPV: any,
  index: number,
  json: any
): JSONMinidynReport => {
  const report: JSONMinidynReport = {
    version: 1,
    base: convertPRJZToBaseReport(jsonPV, index, {
      machine: 'Minidyn',
      dropIndexes: convertPRJZToMinidynDropIndexes(json),
      testChoices: convertPRJZToTestChoices(json),
    }),
    distinct: convertPRJZToMinidynReportDistinct(json),
  }

  report.base.zones[0].base.points.push(
    ...jsonPV.Points.map(
      (jsonPoint: any, index: number): JSONMinidynPoint =>
        convertPRJZToMinidynPoint(jsonPoint, index, json)
    )
  )

  return report
}

export const convertPRJZToMinidynReportDistinct = (
  json: any
): JSONMinidynReportDistinct => {
  const dropChoices = convertPRJZToMinidynDropChoices(json)
  const dropIndexes = convertPRJZToMinidynDropIndexes(json)
  const testChoices = convertPRJZToTestChoices(json)

  return {
    version: 1,
    thresholdsSelected: {
      modulus: 0,
      deflection: 0,
      force: 0,
      temperature: 0,
      time: 0,
      percentage: 0,
      stiffness: 0,
    },
    groupedDataLabels: {
      selected: 1,
      list: [
        {
          version: 1,
          from: 'Drop',
          choices: {
            selected: 0,
            list: dropChoices,
          },
          indexes: {
            selected: dropIndexes.length - 1,
            list: dropIndexes,
          },
        },
        {
          version: 1,
          from: 'Test',
          choices: {
            selected:
              testChoices.findIndex(
                (choice) => choice.name === 'BearingCapacity'
              ) || 0,
            list: testChoices as JSONDataLabel<MinidynUnitsNames>[],
          },
        },
        {
          version: 1,
          from: 'Zone',
          choices: {
            selected: 0,
            list: [],
          },
        },
      ],
    },
  }
}
