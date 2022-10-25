import { convertPRJZToBaseReport } from './base'
import {
  convertPRJZToMaxidynDropChoices,
  convertPRJZToMaxidynDropIndexes,
} from '../drop'
import { convertPRJZToMaxidynPoint } from '../point'
import { convertPRJZToTestChoices } from '../shared'

export const convertPRJZToMaxidynReport = (
  jsonPV: any,
  index: number,
  json: any
): JSONMaxidynReport => {
  const report: JSONMaxidynReport = {
    version: 1,
    base: convertPRJZToBaseReport(jsonPV, index, {
      machine: 'Maxidyn',
      dropIndexes: convertPRJZToMaxidynDropIndexes(json),
      testChoices: convertPRJZToTestChoices(json),
    }),
    distinct: convertPRJZToMaxidynReportDistinct(json),
  }

  report.base.zones[0].base.points.push(
    ...jsonPV.Points.map(
      (jsonPoint: any, index: number): JSONMaxidynPoint =>
        convertPRJZToMaxidynPoint(jsonPoint, index, json)
    )
  )

  return report
}

export const convertPRJZToMaxidynReportDistinct = (
  json: any
): JSONMaxidynReportDistinct => {
  const dropChoices = convertPRJZToMaxidynDropChoices(json)
  const dropIndexes = convertPRJZToMaxidynDropIndexes(json)
  const testChoices = convertPRJZToTestChoices(json)

  return {
    version: 1,
    thresholdsSelected: {
      modulus: 0,
      deflection: 0,
      force: 0,
      distance: 0,
      time: 0,
      stiffness: 0,
      percentage: 0,
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
            list: testChoices as JSONDataLabel<MaxidynUnitsNames>[],
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
