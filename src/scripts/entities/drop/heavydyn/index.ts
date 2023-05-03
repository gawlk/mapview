import { createMathNumber } from '/src/scripts'

import { createBaseDropFromJSON, createBaseDropIndexFromJSON } from '../base'

export const createHeavydynDropFromJSON = (
  json: JSONHeavydynDropVAny,
  parameters: {
    point: HeavydynPoint
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

  const drop: HeavydynDrop = shallowReactive({
    ...baseDrop,
    machine: 'Heavydyn',
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

const upgradeJSONDrop = (json: JSONHeavydynDropVAny): JSONHeavydynDrop => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}

export const createHeavydynDropIndexFromJSON = (
  json: JSONHeavydynDropIndex,
  parameters: {
    project: HeavydynProject
  }
) => {
  json = upgradeJSONDropIndex(json)

  const unitName = json.distinct.unit.toLocaleLowerCase()

  const dropIndex: HeavydynDropIndex = {
    ...createBaseDropIndexFromJSON(json.base),
    machine: 'Heavydyn',
    type: json.distinct.type,
    value: createMathNumber(
      json.distinct.value,
      parameters.project.units[unitName as keyof HeavydynMathUnits]
    ),
    toJSON() {
      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
          type: json.distinct.type,
          unit: json.distinct.unit,
          value: json.distinct.value,
        },
      }
    },
  }

  return dropIndex
}

const upgradeJSONDropIndex = (
  json: JSONHeavydynDropIndexVAny
  // disable until we manage other case
  // eslint-disable-next-line sonarjs/no-identical-functions
): JSONHeavydynDropIndex => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
