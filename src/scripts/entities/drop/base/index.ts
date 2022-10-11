import { createDataValueFromJSON } from '/src/scripts'

interface BaseDropCreatorParameters extends MachineDropCreatorParameters {
  machine: MachineName
}

export const createBaseDropFromJSON = (
  json: JSONBaseDropVAny,
  parameters: BaseDropCreatorParameters
): BaseDrop => {
  json = upgradeJSONDrop(json)

  const dropList = (
    parameters.point.zone.report.dataLabels.groups
      .list as MachineGroupedDataLabels[]
  ).find((groupedDataLabels) => groupedDataLabels.from === 'Drop')

  const index = dropList?.indexes?.list[json.index] as MachineDropIndex

  return {
    index,
    data: json.data.map(
      (jsonDataValue): DataValue<string> =>
        createDataValueFromJSON(jsonDataValue, dropList?.choices.list || [])
    ),
    additionalFields: [],
    point: parameters.point,
    toBaseJSON: function (): JSONBaseDrop {
      return {
        ...json,
        data: this.data.map((data) => data.toJSON()),
      }
    },
  }
}

const upgradeJSONDrop = (json: JSONBaseDropVAny): JSONBaseDrop => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONBaseDrop
  }

  return json
}

export const createBaseDropIndexFromJSON = (
  json: JSONBaseDropIndexVAny
): BaseDropIndex => {
  json = upgradeJSONDropIndex(json)

  return {
    ...json,
  }
}

const upgradeJSONDropIndex = (
  json: JSONBaseDropIndexVAny
): JSONBaseDropIndex => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONBaseDropIndex
  }

  return json
}
