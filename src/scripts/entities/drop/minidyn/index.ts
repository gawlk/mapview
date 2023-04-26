/* eslint-disable no-fallthrough */
import { createBaseDropFromJSON, createBaseDropIndexFromJSON } from '../base'

export const createMinidynDropFromJSON = (
  json: JSONMinidynDropVAny,
  parameters: {
    point: MinidynPoint
  }
) => {
  json = upgradeJSONDrop(json)

  const dropGroup = parameters.point.zone.report.dataLabels.groups.list[0]

  const index = dropGroup?.indexes?.list[json.base.index]

  const baseDrop = createBaseDropFromJSON(json.base, {
    point: parameters.point,
    index,
    dropGroup,
  })

  const drop: MinidynDrop = shallowReactive({
    ...baseDrop,
    machine: 'Minidyn',
    toJSON() {
      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
        },
      }
    },
  })

  return drop
}

const upgradeJSONDrop = (json: JSONMinidynDropVAny): JSONMinidynDrop => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}

export const createMinidynDropIndexFromJSON = (
  json: JSONMinidynDropIndexVAny
) => {
  json = upgradeJSONDropIndex(json)

  const dropIndex: MinidynDropIndex = {
    ...createBaseDropIndexFromJSON(json.base),
    machine: 'Minidyn',
    type: json.distinct.type,
    toJSON() {
      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
          type: json.distinct.type,
        },
      }
    },
  }

  return dropIndex
}

const upgradeJSONDropIndex = (
  json: JSONMinidynDropIndexVAny
  // disable until we manage some case
  // eslint-disable-next-line sonarjs/no-identical-functions
): JSONMinidynDropIndex => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
