import { defaultThresholds } from '/src/scripts/entities'

import { convertPRJZToBaseReport } from './base'

import {
  convertPRJZToMaxidynDropChoices,
  convertPRJZToMaxidynDropIndexes,
} from '../drop'
import { convertPRJZToMaxidynPoint } from '../point'
import { convertPRJZToTestChoices } from '../shared'

export const convertPRJZToMaxidynReport = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonPV: any,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONMaxidynReport => {
  const report: JSONMaxidynReport = {
    version: 1,
    base: convertPRJZToBaseReport(jsonPV, index, {
      machine: 'Maxidyn',
      dropChoices: convertPRJZToMaxidynDropChoices(json),
      dropIndexes: convertPRJZToMaxidynDropIndexes(json),
      testChoices: convertPRJZToTestChoices(json),
    }),
    distinct: convertPRJZToMaxidynReportDistinct(jsonPV, json),
  }

  report.base.zones[0].base.points.push(
    ...jsonPV.Points.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (jsonPoint: any, pointIndex: number): JSONMaxidynPoint =>
        convertPRJZToMaxidynPoint(jsonPoint, pointIndex, json)
    )
  )

  return report
}

export const convertPRJZToMaxidynReportDistinct = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonPV: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONMaxidynReportDistinct => {
  const dropChoices = convertPRJZToMaxidynDropChoices(json)
  const dropIndexes = convertPRJZToMaxidynDropIndexes(json)
  const testChoices = convertPRJZToTestChoices(json)

  const modulusThresholdIndex = defaultThresholds.modulus.findIndex(
    (threshold) => {
      return threshold.value === jsonPV.Threshold.Threshold
    }
  )

  return {
    version: 1,
    thresholds: {
      modulus: {
        version: 1,
        selectedIndex: modulusThresholdIndex,
        custom: {
          version: 1,
          type: 'Bicolor',
          value: modulusThresholdIndex === -1 ? jsonPV.Threshold.Threshold : 0,
          valueHigh:
            modulusThresholdIndex === -1 ? jsonPV.Threshold.Threshold : 0,
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
              selectedIndex: 0,
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
              selectedIndex:
                testChoices.findIndex(
                  (choice) =>
                    choice.unit === 'modulus' || choice.unit === 'stiffness'
                ) || 0,
              list: testChoices as JSONDataLabel<MaxidynUnitsNames>[],
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
