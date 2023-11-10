import { ReactiveMap } from '@solid-primitives/map'

import { createASS, createDataValueFromJSON } from '/src/scripts'

export const createBaseDropFromJSON = <
  Point extends MachinePoint,
  DropIndex extends MachineDropIndex,
  DropGroup extends MachineDropDataLabelsGroup,
>(
  json: JSONBaseDropVAny,
  parameters: {
    point: Point
    index: DropIndex
    dropGroup: DropGroup
  },
) => {
  json = upgradeJSONDrop(json)

  const dataset = new ReactiveMap<DataLabel, DataValue<string>>()
  json.data.forEach((jsonDataValue) => {
    const dataValue = createDataValueFromJSON(
      jsonDataValue,
      parameters.dropGroup.choices.list(),
    )

    dataset.set(dataValue.label, dataValue)
  })

  const drop: BaseDrop<DropIndex, Point> = {
    index: parameters.index,
    dataset,
    point: parameters.point,
    impactData: createASS(null),
    toBaseJSON() {
      return {
        version: json.version,
        data: Array.from(this.dataset.values())
          .filter((data) =>
            this.point
              .zone()
              .report()
              .dataLabels.groups.list()[0]
              .saveableChoices.includes(data.label),
          )
          .map((data) => data.toJSON()),
        index: json.index,
      }
    },
  }

  return drop
}

const upgradeJSONDrop = (json: JSONBaseDropVAny): JSONBaseDrop => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}

export const createBaseDropIndexFromJSON = (
  json: JSONBaseDropIndexVAny,
): BaseDropIndex => {
  json = upgradeJSONDropIndex(json)

  return {
    displayedIndex: json.displayedIndex,
    toBaseJSON(): JSONBaseDropIndex {
      return {
        version: json.version,
        displayedIndex: json.displayedIndex,
      }
    },
  }
}

const upgradeJSONDropIndex = (
  json: JSONBaseDropIndexVAny,
  // Disable rule until there are at least 2 versions
  // eslint-disable-next-line sonarjs/no-identical-functions
): JSONBaseDropIndex => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
