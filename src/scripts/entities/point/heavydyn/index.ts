import { createBasePoint } from '../base'

export const createHeavydynPoint = (data: unknown, map: mapboxgl.Map) => {
  const basePoint = createBasePoint(data, map)

  const point: HeavydynPoint = {
    kind: 'heavydyn' as const,
    ...basePoint,
  }

  return point
}
