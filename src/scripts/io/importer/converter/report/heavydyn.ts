import { convertPRJZToBaseReport } from './base'
import {
  convertPRJZToHeavydynDropChoices,
  convertPRJZToHeavydynDropIndexes,
} from '../drop'
import { convertPRJZToHeavydynPoint } from '../point'
import { convertPRJZToTestChoices } from '../shared'

export const convertPRJZToHeavydynReport = (
  jsonPV: any,
  index: number,
  json: any
): JSONHeavydynReport => {
  const report: JSONHeavydynReport = {
    version: 1,
    base: convertPRJZToBaseReport(jsonPV, index, {
      machine: 'Heavydyn',
      dropIndexes: convertPRJZToHeavydynDropIndexes(json),
      testChoices: convertPRJZToTestChoices(json),
    }),
    distinct: convertPRJZToHeavydynReportDistinct(json),
  }

  report.base.zones[0].base.points.push(
    ...jsonPV.Points.map(
      (jsonPoint: any, index: number): JSONHeavydynPoint =>
        convertPRJZToHeavydynPoint(jsonPoint, index, json)
    )
  )

  return report
}

export const convertPRJZToHeavydynReportDistinct = (
  json: any
): JSONHeavydynReportDistinct => {
  const dropChoices = convertPRJZToHeavydynDropChoices(json)
  const dropIndexes = convertPRJZToHeavydynDropIndexes(json)
  const testChoices = convertPRJZToTestChoices(json)

  return {
    version: 1,
    thresholdsSelected: {
      deflection: 0,
      force: 0,
      temperature: 0,
      distance: 0,
      time: 0,
    },
    groupedDataLabels: {
      selected: 0,
      list: [
        {
          version: 1,
          from: 'Drop',
          choices: {
            selected:
              dropChoices.findIndex((choice) => choice.name === 'D0') || 0,
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
            selected: 0,
            list: testChoices as JSONDataLabel<HeavydynUnitsNames>[],
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
