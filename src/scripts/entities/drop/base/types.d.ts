interface BaseDrop {
  index: MachineDropIndex
  data: DataValue[]
  additionnalFields: MachineField[]
}

interface JSONDrop {
  index: number
  data: JSONDataValue[]
}

interface BaseDropCreatorParameters extends MachineDropCreatorParameters {
  machine: MachineName
}
