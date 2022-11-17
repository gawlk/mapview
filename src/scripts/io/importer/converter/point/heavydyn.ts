import { convertPRJZToBasePoint } from './base'

import { convertPRJZToHeavydynDrop } from '../drop'

export const convertPRJZToHeavydynPoint = (
  jsonPoint: any,
  index: number,
  json: any
): JSONHeavydynPoint => {
  const point: JSONHeavydynPoint = {
    version: 1,
    base: convertPRJZToBasePoint(jsonPoint, index, json),
    distinct: convertPRJZToHeavydynPointDistinct(jsonPoint),
  }

  point.base.drops.push(
    ...jsonPoint.Drops.map(
      (jsonDrop: any, index: number): JSONHeavydynDrop =>
        convertPRJZToHeavydynDrop(jsonDrop, index, json)
    )
  )

  return point
}

export const convertPRJZToHeavydynPointDistinct = (
  jsonPoint: any
): JSONHeavydynPointDistinct => {
  return {
    version: 1,
  }
}
