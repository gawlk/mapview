import { createBasePoint } from '../base'

export const createMaxidynPoint = (data: unknown, map: mapboxgl.Map) => {
  const basePoint = createBasePoint(data, map)

  const point: MaxidynPoint = {
    kind: 'maxidyn' as const,
    ...basePoint,
  }

  return point
}
