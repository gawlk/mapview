interface BaseDrop {
  index: MachineDropIndex
  data: DataValue<string>[]
  additionalFields: MachineField[]
  point: MachinePoint
  // ?
}

interface JSONDrop {
  index: number
  data: JSONDataValue[]
}

interface BaseDropCreatorParameters extends MachineDropCreatorParameters {
  machine: MachineName
}

interface BaseDropIndex {
  readonly type: string
  readonly displayedIndex: number
}

interface JSONBaseDropIndex {
  version: 1
  readonly type: string
  readonly displayedIndex: number
}
