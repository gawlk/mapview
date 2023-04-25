import { convertPRJZToBaseReport } from './base'

import {
  convertPRJZToMinidynDropChoices,
  convertPRJZToMinidynDropIndexes,
} from '../drop'
import { convertPRJZToMinidynPoint } from '../point'
import { convertPRJZToTestChoices } from '../shared'

export const convertPRJZToMinidynReport = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonPV: any,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONMinidynReport => {
  const report: JSONMinidynReport = {
    version: 1,
    base: convertPRJZToBaseReport(jsonPV, index, {
      machine: 'Minidyn',
      dropChoices: convertPRJZToMinidynDropChoices(json),
      dropIndexes: convertPRJZToMinidynDropIndexes(json),
      testChoices: convertPRJZToTestChoices(json),
    }),
    distinct: convertPRJZToMinidynReportDistinct(json),
  }

  report.base.zones[0].base.points.push(
    ...jsonPV.Points.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (jsonPoint: any, pointIndex: number): JSONMinidynPoint =>
        convertPRJZToMinidynPoint(jsonPoint, pointIndex, json)
    )
  )

  return report
}

export const convertPRJZToMinidynReportDistinct = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONMinidynReportDistinct => {
  const dropChoices = convertPRJZToMinidynDropChoices(json)
  const dropIndexes = convertPRJZToMinidynDropIndexes(json)
  const testChoices = convertPRJZToTestChoices(json)

  // Threshold

  return {
    version: 1,
    thresholds: {
      version: 1,
      modulus: {
        version: 1,
        selectedIndex: 0,
        custom: {
          version: 1,
          type: 'Bicolor',
          value: 0,
          valueHigh: 0,
        },
      },
      deflection: {
        version: 1,
        selectedIndex: 0,
        custom: {
          version: 1,
          type: 'Bicolor',
          value: 0,
          valueHigh: 0,
        },
      },
      force: {
        version: 1,
        selectedIndex: 0,
        custom: {
          version: 1,
          type: 'Bicolor',
          value: 0,
          valueHigh: 0,
        },
      },
      distance: {
        version: 1,
        selectedIndex: 0,
        custom: {
          version: 1,
          type: 'Bicolor',
          value: 0,
          valueHigh: 0,
        },
      },
      time: {
        version: 1,
        selectedIndex: 0,
        custom: {
          version: 1,
          type: 'Bicolor',
          value: 0,
          valueHigh: 0,
        },
      },
      percentage: {
        version: 1,
        selectedIndex: 0,
        custom: {
          version: 1,
          type: 'Bicolor',
          value: 0,
          valueHigh: 0,
        },
      },
      stiffness: {
        version: 1,
        selectedIndex: 0,
        custom: {
          version: 1,
          type: 'Bicolor',
          value: 0,
          valueHigh: 0,
        },
      },
    },
    dataLabels: {
      version: 1,
      selectedIndex: 1,
      list: [
        {
          version: 1,
          base: {
            version: 1,
            from: 'Drop',
            choices: {
              version: 1,
              selectedIndex: null,
              list: dropChoices,
            },
          },
          distinct: {
            version: 1,
            indexes: {
              version: 1,
              selectedIndex: dropIndexes.length - 1,
              list: dropIndexes,
            },
          },
        },
        {
          version: 1,
          base: {
            version: 1,
            from: 'Point',
            choices: {
              version: 1,
              selectedIndex: null,
              list: testChoices as JSONDataLabel<MinidynUnitsNames>[],
            },
          },
          distinct: {
            version: 1,
          },
        },
        {
          version: 1,
          base: {
            version: 1,
            from: 'Zone',
            choices: {
              version: 1,
              selectedIndex: 0,
              list: [],
            },
          },
          distinct: {
            version: 1,
          },
        },
      ],
    },
  }
}
