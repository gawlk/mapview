import { convertPRJZToBasePoint } from './base'

import { convertPRJZToHeavydynDrop } from '../drop'

export const convertPRJZToHeavydynPoint = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonPoint: any,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONHeavydynPoint => {
  const point: JSONHeavydynPoint = {
    version: 1,
    base: convertPRJZToBasePoint(jsonPoint, index, json),
    distinct: convertPRJZToHeavydynPointDistinct(jsonPoint),
  }

  point.base.drops.push(
    ...jsonPoint.Drops.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (jsonDrop: any, dropIndex: number): JSONHeavydynDrop =>
        convertPRJZToHeavydynDrop(jsonDrop, dropIndex, json)
    )
  )

  return point
}

export const convertPRJZToHeavydynPointDistinct = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonPoint: any
): JSONHeavydynPointDistinct => {
  return {
    version: 1,
  }
}
